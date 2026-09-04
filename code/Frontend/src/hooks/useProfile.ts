import {useCallback} from "react";

import {useGetProfileInfoQuery, usePatchUserByIdMutation} from "@/app/redux/api/users.api";
import {PatchUserI} from "@/shared/types/api/shiftEditorApi";
import {UserProfileI} from "@/shared/types/profile";

export const useProfile = () => {
    const [patchUser] = usePatchUserByIdMutation();
    const { refetch: refetchProfile } = useGetProfileInfoQuery();

    const handlePatchUser = useCallback(async (data: PatchUserI) => {
        await patchUser(data)
    }, [patchUser])


    const handleGetProfile = useCallback(async (): Promise<UserProfileI | undefined> => {
        const { data, isError } = await refetchProfile();
        if (!isError && data) {
            return data
        }
        return undefined;
    }, [refetchProfile]);


    return { handlePatchUser, handleGetProfile };
};
