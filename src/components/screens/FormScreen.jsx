import React, { useState } from "react";
import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "reactstrap";
import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const genId = () => {
  return uuidv4();
};

const FormScreen = () => {
  const [recipientName, setRecipientName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [all_users, setAllUser] = useState([]);
  const [toggledContainer, setToggledContainer] = useState(true);
  const [filtered_users, setFilteredUsers] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [senderObj, setSenderObj] = useState("");
  const [messageToggle, setMessageToggle] = useState(false);
  const location = useLocation();
  localStorage.setItem("name", location.state.name);
  let localName = localStorage.getItem("name");
  console.log(localName);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Form submitted, ${recipientName}`);
    setRecipientName("");
    setTitle("");
    setMessage("");
  };

  const fetchData = async () => {
    await axios
      .get(baseUrl + "/users")
      .then((res) => setAllUser(res.data))

      .catch((err) => console.log(err));
  };

  const fetchSender = async () => {
    await axios
      .post(baseUrl + "/sender", { n: localStorage.getItem("name") })
      .then((res) => {
        setSenderObj(res.data);
        setSender(res.data[0]["name"]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
    fetchSender();
  }, []);

  useLayoutEffect(() => {
    fetchData();
    fetchSender();
  }, []);

  const updateRecipient = async () => {
    let email = {
      title,
      message,
      reciever: recipient,
      sender: sender,
      status: true,
      customId: genId(),
    };

    await axios
      .patch(baseUrl + "/receiver", {
        recipient: String(recipientName),
        email: email,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateSender = async () => {
    let email = {
      title,
      message,
      reciever: recipient,
      sender: localName,
      status: true,
      customId: genId(),
    };

    await axios
      .patch(baseUrl + "/sender", {
        sender: String(email.sender),
        email: email,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let email = {
    title,
    message,
    reciever: recipient,
    sender: location.state.name,
    status: true,
    customId: genId(),
  };

  return (
    <Container className="p-5 m-5">
      <div>
        <div className="alert alert-dismissible alert-light">
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
          ></button>
          <strong>{localName} is Sending Email</strong>
          <Container>
            <form className="p-5" onSubmit={handleSubmit}>
              <fieldset>
                <center>
                  <h1>Send Message</h1>
                </center>
                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label mt-4"
                  >
                    Name
                  </label>
                  <input
                    onBlur={() => setToggledContainer(false)}
                    value={recipientName}
                    onFocus={() => {
                      setMessageToggle(true);
                    }}
                    onChange={(e) => {
                      setToggledContainer(true);
                      setRecipientName(e.target.value);
                      setFilteredUsers(
                        all_users.filter((user) => {
                          return user.name.includes(e.target.value);
                        })
                      );
                      console.log(filtered_users);
                      setRecipient(
                        all_users.filter((el) => {
                          return el.name.includes(e.target.value);
                        })[0]["name"]
                      );
                    }}
                    type="name"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="recipient name"
                  />
                </div>
                {recipientName.length > 0 ? (
                  <Container
                    className={`py-3 ${toggledContainer ? "" : "d-none"}`}
                  >
                    <div className=" p-1">
                      {filtered_users.map((user, index) => {
                        return (
                          <h5
                            key={index}
                            onClick={() => {
                              setRecipientName(user.name);
                              setToggledContainer(false);
                            }}
                          >
                            {user.name}
                          </h5>
                        );
                      })}
                    </div>
                  </Container>
                ) : (
                  ""
                )}
                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label mt-4"
                  >
                    Title
                  </label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="title"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="enter title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleTextarea" className="form-label mt-4">
                    Message
                  </label>
                  <textarea
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="form-control"
                    id="exampleTextarea"
                    rows="3"
                  ></textarea>
                </div>
                <center>
                  <button
                    type="submit"
                    className=" mx-5 mt-5 btn btn-primary"
                    onClick={async () => {
                      if (message.length > 0 && recipientName.length > 0) {
                        updateRecipient();
                        updateSender();

                        setTimeout(() => {}, 3500);

                        await axios
                          .post(baseUrl + "/new_message", {
                            email,
                          })
                          .then((res) => console.log(res))
                          .catch((err) => console.log(err));
                      } else {
                        alert("Please fill the form!!!");
                      }
                    }}
                  >
                    Submit
                  </button>
                </center>
              </fieldset>
            </form>
          </Container>
        </div>

        {messageToggle ? (
          <Container
            className="rounded-3 my-4 p-4"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
            }}
          >
            <div className="d-flex flex-column justify-content-start align-items-center">
              <h4 className="m-3">Recieved messages</h4>
              {Object.keys(senderObj).length > 0 &&
                senderObj[0].received.map((element, i) => (
                  <div
                    key={i}
                    className="alert my-2 alert-light w-100"
                    role="alert"
                  >
                    <Container className="d-flex justify-content-between">
                      <h5>
                        <span className="fs-5 mx-2">From:</span>
                        {element.sender}
                      </h5>
                      <h5>
                        <span className="fs-5"></span> {element.status}
                      </h5>
                    </Container>
                    <Container className="px-4">
                      <strong>
                        <span>Title: {element.title}</span>
                      </strong>
                      <p className="m-0">Message:</p>
                      <div
                        style={{
                          border: "1.5px solid #A0C3D2",
                        }}
                        className="bg-white rounded-3 px-3 py-1"
                      >
                        <p className="m-0">{element.message}</p>
                      </div>
                    </Container>
                  </div>
                ))}
            </div>
          </Container>
        ) : (
          ""
        )}
      </div>
    </Container>
  );
};

export default FormScreen;
