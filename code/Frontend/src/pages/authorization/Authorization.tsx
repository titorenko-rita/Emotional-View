import {Flex, Title} from "@mantine/core";

import {FormWrapper} from "@/components";
import {useLogin} from "@/hooks/useLogin";
import {LoginForm} from "@/pages/authorization/components/login-form/LoginForm";


export const Authorization = ()=> {
    const {handleLogin, errorMessage} = useLogin()

    return (
        <FormWrapper formId='login'>
            <Flex justify='center' align='center'>
                <Title>
                    Вход
                </Title>
            </Flex>
            <LoginForm handleSubmit={handleLogin} errorMessage={errorMessage}/>
        </FormWrapper>
    )
}
