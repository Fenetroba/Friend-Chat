import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const TopeNav = () => {
  return (
    <div className="shadow-2xl   bg-[var(--four)] p-3">
      <Link to='/requests'>
        <Button className="bg-[var(--two)] rounded-2xl hover:bg-[var(--one)]  cursor-pointer">
          MY Requests
        </Button>
      </Link>
    </div>
  );
};

export default TopeNav;
