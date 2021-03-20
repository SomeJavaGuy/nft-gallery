import React from "react";
import { Html } from "@react-three/drei";
import { position } from "../types/position";

type InfoPanelProps = {
  info: { [key: string]: string };
  position: position;
};

const InfoPanel: React.FC<InfoPanelProps> = ({ info, position, ...props }) => {
  const [x, y, z] = position;

  return (
    <Html
      position={[x, y, z]}
      style={{
        backgroundColor: "rgb(0 0 0 / 75%)",
        color: "white",
        borderRadius: "6px",
        padding: "0 10px 0 10px",
        boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
        backdropFilter: "blur( 4.5px )",
        border: "1px solid rgba( 255, 255, 255, 0.18 )",
        width: "max-content",
      }}
    >
      {Object.entries(info).map(([key, value]) => (
        <p
          key={key}
          style={{
            textShadow: "-1px 2px 6px rgba(0, 0, 0, 0.8)",
          }}
        >
          {key} : {value}
        </p>
      ))}
    </Html>
  );
};

export default InfoPanel;
