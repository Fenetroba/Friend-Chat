import React from "react";

const MessageCrud = ({ TEXTS }) => {
  console.log(TEXTS);
  const DeletHandler = () => {
    console.log("delete")

  };
  const EditHandler = () => {};

  return (
    <div>
      {TEXTS.map((Text, i) =>
        Text.name === "Delete"
          ? console.log("delete")
          : Text.name === "Edit"
          ? EditHandler
          : null
      )}
    </div>
  );
};

export default MessageCrud;
