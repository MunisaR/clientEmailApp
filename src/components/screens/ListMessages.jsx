import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ListMessages = () => {
  const name = useLocation().state;
  localStorage.setItem("localName", name);
  const localName = localStorage.getItem("localName");
  const [all_users, setAllUsers] = useState([]);
  const [user, setUser] = useState("");
  const [messages, setAllMessages] = useState([]);

  console.log(name);

  const fetchUsers = async () => {
    await axios
      .get(baseUrl + "/users")
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.log(err));
  };

  const fetchUser = async () => {
    await axios
      .post(baseUrl + "/get_user", name.localName)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
    fetchUser();
  }, []);

  return (
    <Container className="p-5 m-5 ">
      <h1>{name.localName}</h1>
      {all_users.map((user, i) => {
        return (
          <center key={i} className="my-2 p5">
            <ul className="list-group">
              {all_users.length > 0 && (
                <Link
                  className="text-decoration-none"
                  state={{ name: user.name }}
                  to="/message"
                >
                  <li className="list-group-item d-flex list-group-item-action justify-content-between align-items-center ">
                    {user.name}
                    <span className="badge bg-primary rounded-pill">
                      {user.messages.length}
                    </span>
                  </li>
                </Link>
              )}
            </ul>
          </center>
        );
      })}
    </Container>
  );
};

export default ListMessages;
