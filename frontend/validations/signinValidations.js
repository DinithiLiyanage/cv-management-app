import React from "react";

export default function signinValidations(email, password) {
  const errors = {
    emailErrors: [],
    pwrdErrors: [],
  };

  const email_pattern = /([a-zA-Z0-9.])+@([a-zA-Z])+.([a-z]{2,6})/;

  const pwrd_pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9_]{5,16}$/;

  if (email === "") {
    errors.emailErrors.push("Email can't be empty");
    console.log("Error");
  } else if (!email_pattern.test(email)) {
    errors.emailErrors.push("Not a valid email");
  }

  if (password === "") {
    errors.pwrdErrors.push("Password cannot be empty");
  } else if (!pwrd_pattern.test(password)) {
    errors.pwrdErrors.push(
      "Password should contain atleast one lowercase, an uppercase, a digit and can have underscores."
    );
  }

  return errors;
}
