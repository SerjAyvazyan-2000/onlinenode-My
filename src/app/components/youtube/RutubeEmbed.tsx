"use client";

import React, { useEffect, useRef } from "react";

interface RuTubeEmbedProps {
  /** URL встроенного видео, например: https://rutube.ru/play/embed/<VIDEO_ID> */
  src: string;
  /**
   * При обновлении этого пропа плеер перематывается
   * на указанное время (в секундах).
   */
  seekTime?: number;
}

const RuTubeEmbed: React.FC<RuTubeEmbedProps> = ({ src, seekTime }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  /**
   * Отправка команды в плеер через postMessage.
   * type - тип команды (например, "player:setCurrentTime"),
   * data - объект с полями (например, { time: 30 })
   */
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendCommand = (type: string, data: Record<string, any> = {}) => {
    if (!iframeRef.current) return;
    const message = JSON.stringify({ type, data });
    // "*" => отправляем сообщение во все домены
    iframeRef.current.contentWindow?.postMessage(message, "*");
  };

  // При изменении seekTime отправляем команду перемотки
  useEffect(() => {
    if (typeof seekTime === "number") {
      // Перематываем плеер на указанное время
      sendCommand("player:setCurrentTime", { time: seekTime });
      // По желанию можно сразу запустить воспроизведение:
      // sendCommand("player:play");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekTime]);

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%" }}>
      <iframe
        ref={iframeRef}
        src={src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        frameBorder="0"
        allow="clipboard-write; autoplay"
        allowFullScreen
      />
    </div>
  );
};

export default RuTubeEmbed;
