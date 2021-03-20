import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./Landing.css";

const LandingPage = () => {
  const [isTouchDevice, setisTouchDevice] = useState(false);
  const [formValue, setFormValue] = useState("");
  const history = useHistory();

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    setisTouchDevice(isTouchDevice);
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-main">
        <h1 className="landing-title landing-text-shadow">NFT Gallery</h1>
        <h2 className="landing-subtitle landing-text-shadow">
          Explore the NFTs owned by an Ethereum address
        </h2>
        {isTouchDevice ? (
          <p className="landing-text-shadow">
            Sorry we are only compatible on a desktop device for now
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formValue.length > 0) {
                history.push(`/gallery/owner/${formValue}`);
              }
            }}
          >
            <label className="landing-text-shadow">
              Ethereum Address:
              <input
                type="text"
                value={formValue}
                onChange={(event) => setFormValue(event.target.value)}
                placeholder="0x59a54..."
                className="landing-input"
              />
            </label>
            <input type="submit" value="ENTER" className="landing-submit" />
          </form>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
