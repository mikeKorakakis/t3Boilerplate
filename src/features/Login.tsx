import { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import PasswordInput from "@/core/components/Form/PasswordInput";
import TextInput from "@/core/components/Form/TextInput";
import Button from "@/core/components/LoadingButton";

// import Button from "../../app/common/buttons/Button";
// import Checkbox from "../../app/common/checkboxes/Checkbox";
import { APP_NAME, POST_LOGIN_REDIRECT_URL } from "./../config";

const LoginForm = () => {
  const session = useSession();
  const router  = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      toast.error("You are already logged in");
      router.push(POST_LOGIN_REDIRECT_URL);
    }
  }, [router, session]);

  const defaultValues = {
    username: "",
    password: "",
    remember_me: true,
    error: null,
  };
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({ defaultValues });

  const onSubmit = async (values: typeof defaultValues) => {
    if (values.remember_me) {
      localStorage.setItem("remember_me", "true");
    } else {
      localStorage.setItem("remember_me", "false");
    }
    // delete values["remember_me"];
    try {
      await signIn("credentials", {
        email: values.username,
        password: values.password,
        callbackUrl: POST_LOGIN_REDIRECT_URL,
        //   redirect: false
      });
      //   await userStore.login(values);
    } catch (error: any) {
      toast.error("Wrong username or password");
    }
  };
  return (
    <div className="min-w-screen from-primary-500 flex min-h-screen items-center justify-center bg-gradient-to-l px-5 py-5">
      <div
        className="w-[28rem] overflow-hidden rounded-3xl bg-gray-100 text-gray-500 shadow-xl"
        
      >
        <div className="w-full md:flex">
          
          <div className="w-full py-10 px-5 md:px-10">
            <div className="mb-10 text-center">
              <h1 className="font-mono text-3xl font-bold text-gray-900">
                {APP_NAME}
              </h1>
              <p>???????????????? ???? ???????????????? ?????? ?????? ???? ????????????????????</p>
              <p>
                ?????????????? ??????{" "}
                <span
                  onClick={() =>
                    reset({
                      username: "admin",
                      password: "Pa$$w0rd",
                    })
                  }
                  className="text-primary-500 cursor-pointer underline"
                >
                  ????????????????????????
                </span>{" "}
                ??{" "}
                <span
                  onClick={() =>
                    reset({
                      username: "user",
                      password: "Pa$$w0rd",
                    })
                  }
                  className="text-primary-500 cursor-pointer underline"
                >
                  ??????????????
                </span>
              </p>
            </div>
            <div className="h-2"></div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TextInput
                label="?????????? ????????????"
                {...register("username", {
                  required: true,
                })}
                name="username"
                type="text"
                autoComplete="username"
                error={errors.username && "???? ?????????? ???????????? ?????????? ????????????????????"}
              />

              <PasswordInput
                label="?????????????? ??????????????????"
                {...register("password", {
                  required: true,
                })}
                id="password"
                name="password"
                autoComplete="password"
                error={
                  errors.password && "?? ?????????????? ?????????????????? ?????????? ??????????????????????"
                }
              />

              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <Checkbox
                    {...register("remember_me")}
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    label="???? ???? ??????????????"
                  />
                </div> */}
              </div>
              {/* <div className="h-1"></div> */}
              <div>
                <Button
                  loading={isSubmitting}
                  type="submit"
                  disabled={isSubmitting}
                >
                  SUBMIT
                </Button>
              </div>
              <div className="h-2"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
