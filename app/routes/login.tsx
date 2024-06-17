import {Form} from "@remix-run/react";

function Login() {
    return (
        <div className={"login-container"}>
            <Form className={"form"}>
                <label htmlFor={"mail"}>Enter an email</label>
                <input type="email" id={"mail"} name={"mail"} placeholder={"example@gmail.com"} required/>
                <label htmlFor={"pass"}>Enter a password</label>
                <input type="password" id={"pass"} name={"pass"} placeholder={"***********"} required/>
                <button type="submit">Login</button>
            </Form>
        </div>
    );
}

export default Login;