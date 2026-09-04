import {
  Authorization as AuthPage,
  Monitoring as MonitoringPage,
  Profile as ProfilePage,
  ShiftEditor as ShiftEditorPage,
  UploadAI as UploadAIPage,
  UserEditor as UserEditorPage,
  Camera as CameraPage
} from "@/pages";
import {ChangePassword} from "@/pages/change-password/ChangePassword";

import {PageType, RouteName, RoutesType} from "./types";

export const routes: RoutesType = {
  [RouteName.Auth]: {
    title: "Auth",
    path: "/",
    component: AuthPage,
    type: PageType.unAuthenticated,
  },
  [RouteName.UserEditor]: {
    title: 'UserEditor',
    path: '/userEditor',
    component: UserEditorPage,
    type: PageType.root
  },
  [RouteName.ShiftEditor]: {
    title: 'ChangeShift',
    path: '/shiftEditor',
    component: ShiftEditorPage,
    type: [PageType.root, PageType.supervisor]
  },
  [RouteName.Monitoring]: {
    title: "Monitoring",
    path: '/monitoring',
    component: MonitoringPage,
    type: [PageType.root, PageType.supervisor, PageType.manager]
  },
  [RouteName.Profile]: {
    title: "Profile",
    path: "/profile",
    component: ProfilePage,
    type: [PageType.root, PageType.supervisor, PageType.manager]
  },
  [RouteName.ChangePassword]:{
    title: 'ChangePassword',
    path: "/changePassword",
    component: ChangePassword,
    type: [PageType.root, PageType.supervisor, PageType.manager]
  },
  [RouteName.UploadAI]: {
    title: "UploadAI",
    path: "/uploadAI",
    component: UploadAIPage,
    type: [PageType.root, PageType.supervisor, PageType.manager]
  },
  [RouteName.Camera]: {
    title: "Camera",
    path: "/camera",
    component: CameraPage,
    type: [PageType.root, PageType.supervisor, PageType.manager],
  },
};
