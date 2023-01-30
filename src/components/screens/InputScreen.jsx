import { Container } from "reactstrap";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Input = () => {
  const [_, setFinal] = useState("");
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`Form submitted, ${name}`);

    setName("");
  };

  const saveUser = async () => {
    axios.post("/user", { name: name }).then((res) => {
      setFinal(name);
      console.log(res);
    });
  };

  return (
    <Container className="p-5 m-5">
      <center>
        <div className="form-group m-5 p-5">
          <h1>Enter your Name</h1>
          <label htmlFor={name}></label>
          <form onSubmit={handleSubmit}>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your name"
              className="form-control"
            />
            {console.log(name)}
            <Link state={{ name }} to="/next">
              <button
                onClick={saveUser}
                type="submit"
                className=" mx-5 mt-3 btn btn-primary"
              >
                Send
              </button>
            </Link>
          </form>
        </div>
      </center>
    </Container>
  );
};

export default Input;
