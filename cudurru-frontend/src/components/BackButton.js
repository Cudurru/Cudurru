import React, {Component, Fragment} from "react";
import {Link, useHistory} from "react-router-dom";

export const BackButton = () => {
  let history = useHistory();

  return (
        <button className="saveProgress rounded save-progress" onClick={() => history.goBack()}>Back</button>
  );
}

export default BackButton;