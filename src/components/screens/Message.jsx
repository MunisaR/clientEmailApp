import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Message = () => {
  const { name } = useLocation().state;

  localStorage.setItem("localName", name);

  const localName = localStorage.getItem("localName");
  const fetchData = async () => {
    await axios
      .post(baseUrl + "/get_user", { localName })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>{localName}</h1>
    </>
  );
};

export default Message;
