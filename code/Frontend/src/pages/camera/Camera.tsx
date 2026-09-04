import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button, Group, Stack, Text, TextInput, Paper } from "@mantine/core";

import {emotionLabelsRu} from "@/shared/utils/translate";

type EmotItem = {
  time: string;
  emotion: string;
  number: number;
};

function formatTimeRu(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const mapEmotionToNumber = (emotion: string): number => {
  switch (emotion) {
    case "Neutral":
      return 1;
    case "Happy":
      return 2;
    case "Surprise":
      return 3;
    case "Sad":
      return 4;
    case "Angry":
      return 5;
    case "Disgust":
      return 6;
    case "Fear":
      return 7;
    default:
      return 1;
  }
};

function mapExpressionToEmotion(expr: string): string {
  switch (expr) {
    case "neutral":
      return "Neutral";
    case "happy":
      return "Happy";
    case "sad":
      return "Sad";
    case "angry":
      return "Angry";
    case "fearful":
      return "Fear";
    case "disgusted":
      return "Disgust";
    case "surprised":
      return "Surprise";
    default:
      return "Neutral";
  }
}

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const lastPushTsRef = useRef<number>(0);

  const [modelsReady, setModelsReady] = useState(false);
  const [running, setRunning] = useState(false);

  const [deviceMac, setDeviceMac] = useState("WEB-DEMO-1");
  const [lastEmotion, setLastEmotion] = useState<string>("—");
  const [lastConfidence, setLastConfidence] = useState<number | null>(null);

  const [buffer, setBuffer] = useState<EmotItem[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus("Инициализация (CPU)...");
        await faceapi.tf.setBackend("cpu");
        await faceapi.tf.ready();

        setStatus("Загрузка моделей...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");

        if (!cancelled) {
          setModelsReady(true);
          setStatus("Готово.");
        }
      } catch (e: any) {
        if (!cancelled) setStatus(`Ошибка загрузки моделей: ${e?.message ?? e}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function startCamera() {
    setStatus("Запрос доступа к камере...");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    streamRef.current = stream;

    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          resolve();
        };
        video.addEventListener("loadedmetadata", onLoaded);
      });

      await video.play();
    }

    setStatus("Камера запущена.");
  }

  function stopCamera() {
    const stream = streamRef.current;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    const video = videoRef.current;
    if (video) video.srcObject = null;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function stopAnalysisOnly() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }

  async function startSession() {
    if (!modelsReady) {
      setStatus("Модели ещё не загружены.");
      return;
    }

    try {
      if (running) return;

      if (!streamRef.current) {
        await startCamera();
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        setStatus("Видео/Canvas не инициализированы.");
        return;
      }

      lastPushTsRef.current = 0;

      setRunning(true);
      setStatus("Сеанс запущен.");

      intervalRef.current = window.setInterval(async () => {
        try {
          const v = videoRef.current;
          const c = canvasRef.current;
          if (!v || !c) return;

          if (v.readyState < 2 || v.videoWidth === 0 || v.videoHeight === 0) return;

          if (c.width !== v.videoWidth) c.width = v.videoWidth;
          if (c.height !== v.videoHeight) c.height = v.videoHeight;

          const ctx = c.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, c.width, c.height);

          const detections = await faceapi
            .detectAllFaces(
              v,
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 416,
                scoreThreshold: 0.2,
              })
            )
            .withFaceExpressions();

          if (!detections || detections.length === 0) {
            setLastEmotion("Лицо не найдено");
            setLastConfidence(null);
            setStatus("Сеанс запущен. Лицо не найдено.");
            return;
          }

          detections.forEach((d) => {
            const { x, y, width, height } = d.detection.box;
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
          });

          const best = detections
            .slice()
            .sort((a, b) => (b.detection.score ?? 0) - (a.detection.score ?? 0))[0];

          const entries = Object.entries(best.expressions);
          entries.sort((a, b) => b[1] - a[1]);
          const [topExpr, topScore] = entries[0];

          const emotion = mapExpressionToEmotion(topExpr);
          setLastEmotion(emotion);
          setLastConfidence(topScore);

          const now = Date.now();
          if (now - lastPushTsRef.current >= 1000) {
            lastPushTsRef.current = now;
            setBuffer((prev) => [
              ...prev,
              {
                time: formatTimeRu(new Date()),
                emotion,
                number: mapEmotionToNumber(emotion),
              },
            ]);
          }

          setStatus("Сеанс запущен.");
        } catch (e: any) {
          setStatus(`Ошибка анализа: ${e?.message ?? e}`);
        }
      }, 300);
    } catch (e: any) {
      setStatus(`Не удалось запустить сеанс: ${e?.message ?? e}`);
      stopSession();
    }
  }

  function stopSession() {
    stopAnalysisOnly();
    stopCamera();
    setStatus("Сеанс остановлен.");
  }

  async function sendBuffer() {
    if (!deviceMac.trim()) {
      setStatus("Укажи идентификатор устройства (MAC).");
      return;
    }
    if (buffer.length === 0) {
      setStatus("Буфер пуст — нечего отправлять.");
      return;
    }

    try {
      setStatus(`Отправка ${buffer.length} событий...`);

      const payload = { emot: buffer };
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const file = new File([blob], "data.json", { type: "application/json" });

      const form = new FormData();
      form.append("upload_file", file);

      const res = await fetch(
        `/api/rpi_app/rpi/uploadfile?mac=${encodeURIComponent(deviceMac.trim())}`,
        { method: "POST", body: form }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      setBuffer([]);
      setStatus("Отправлено успешно. Буфер очищен.");
    } catch (e: any) {
      setStatus(`Ошибка отправки: ${e?.message ?? e}`);
    }
  }

  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack p="xl" spacing="lg" w="min(96vw, 1320px)">
      <Paper p="xl" withBorder>
        <Text fw={800} size="xl">
          Камера
        </Text>
      </Paper>

      <Paper p="xl" withBorder>
        <Group align="flex-end" grow>
          <TextInput
            label="MAC устройства"
            size="lg"
            value={deviceMac}
            onChange={(e) => setDeviceMac(e.currentTarget.value)}
          />

          {!running ? (
            <Button size="lg" onClick={startSession} disabled={!modelsReady}>
              Начать сеанс
            </Button>
          ) : (
            <Button size="lg" onClick={stopSession} color="red">
              Остановить сеанс
            </Button>
          )}
        </Group>

        <div style={{ marginTop: 20, position: "relative", width: "100%", maxWidth: 1200 }}>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              borderRadius: 12,
              background: "#000",
              display: "block",
            }}
            playsInline
            muted
            autoPlay
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              borderRadius: 12,
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: 16,
            }}
          >
            Эмоция: <b>{emotionLabelsRu[lastEmotion] ?? lastEmotion}</b>
            {lastConfidence !== null ? <> ({Math.round(lastConfidence * 100)}%)</> : null}
          </div>
        </div>

        <Group mt="md">
          <Button size="md" onClick={sendBuffer} variant="light" disabled={buffer.length === 0}>
            Отправить ({buffer.length})
          </Button>
        </Group>

        <Text mt="sm" size="md">
          Статус: {status || "—"}
        </Text>
      </Paper>
    </Stack>
  );
}
