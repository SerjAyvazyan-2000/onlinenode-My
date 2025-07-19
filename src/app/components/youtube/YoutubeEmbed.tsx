"use client";

import React, { useEffect, useRef, useState } from "react";

interface YouTubeEmbedProps {
  /** ID видео в YouTube */
  videoId: string;
  /** Начальное время (в секундах), когда плеер впервые загружается */
  startTime?: number;
  /**
   * Внешний триггер перемотки: если `seekTime` меняется,
   * то плеер перематывается на это время (в секундах).
   */
  seekTime?: number;
}

declare global {
  interface Window {
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  startTime = 0,
  seekTime,
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [player, setPlayer] = useState<any>(null);

  // Загружаем скрипт YouTube Iframe API (если ещё не подгружен) и создаём плеер
  useEffect(() => {
    // Если рендер происходит вне браузера (SSR) или window не доступен
    if (typeof window === "undefined") return;

    // Функция, которая создаёт плеер, когда YT-скрипт уже загружен
    const createPlayer = () => {
      if (!playerRef.current) return;
      // Проверяем, что window.YT действительно инициализирован
      if (!window.YT || !window.YT.Player) return;

      const newPlayer = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          start: startTime,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => {
            // Можно что-то сделать сразу после инициализации
          },
        },
      });
      setPlayer(newPlayer);
    };

    // Если скрипт уже подгружен (например, другой компонент уже вызывал)
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Иначе подключаем скрипт и ждём его загрузки
      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  }, [videoId, startTime]);

  // При изменении `seekTime` (извне), если плеер готов — перематываем
  useEffect(() => {
    if (player && typeof seekTime === "number") {
      // Второй аргумент `true` говорит воспроизвести немедленно
      if (typeof player.seekTo === "function") {
        player.seekTo(seekTime, true);
      }
    }
  }, [seekTime, player]);

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      {/*
        Контейнер с абсолютным позиционированием и 16:9 соотношением.
        YouTube Player «встроится» сюда через window.YT.Player(...)
      */}
      <div ref={playerRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default YouTubeEmbed;
