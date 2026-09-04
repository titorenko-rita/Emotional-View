import {FormEvent, useCallback} from "react";

import {useUploadFileMutation} from "@/app/redux";


export const useUploadFiles = () => {
    const [fileAi, {isLoading, isError}] = useUploadFileMutation()

    const handleSendFile = useCallback(
        async (event: FormEvent) => {
            const input = event.target as HTMLInputElement
            const file = input.files?.[0]

            if (file) {
                const formData = new FormData()
                formData.append('upload_file', file as Blob)
                await fileAi(formData)
            }
        },
        [fileAi]
    )

    return {
        handleSendFile,
        isLoading,
        isError
    }

}