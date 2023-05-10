import React, { useCallback, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/GlobalStoreContext";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import s from "./LoginPage.module.scss";
import { AuthStore } from "../../stores/AuthStore";

export interface IloginData {
  login: string;
  password: string;
}

const formResolver = yupResolver(
  object().shape({
    login: string()
      .email("Неправильный формат почты")
      .required("Обязательное поле"),
    password: string()
      .min(5, "Пароль должен быть не менее 5 символов")
      .required("Обязательное поле"),
  })
);

export default observer(function LoginPage() {
  const authStore = useStore<AuthStore>("authStore");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IloginData>({
    defaultValues: {
      login: "",
      password: "",
    },
    reValidateMode: "onChange",
    resolver: formResolver,
  });

  useEffect(() => {
    if (authStore.session) {
      navigate("/profile");
    }
  }, [authStore.session, navigate]);

  const submit = useCallback(
    async (data: IloginData) => {
      const session = await authStore.login(data.login, data.password);
      if (session.status === 401) {
        setError("root", { message: "Неправильный логин или пароль" });
        return;
      }
    },
    [authStore, setError]
  );

  return (
    <Container className="col-md-5 mx-auto">
      <div className="h2 mb-4">Авторизация</div>
      <Form className={s.LoginPage__form} onSubmit={handleSubmit(submit)}>
        <Form.Label color="red">{errors.root?.message}</Form.Label>
        <Form.Group className="mb-3">
          <Form.Label>Логин</Form.Label>
          <Form.Control {...register("login")} />
          {errors.login?.message && <p>{errors.login?.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control {...register("password")} type="password" />
          {errors.password?.message && <p>{errors.password?.message}</p>}
        </Form.Group>
        <Form.Group>
          <Button type="submit">Войти</Button>
        </Form.Group>
      </Form>
    </Container>
  );
});
