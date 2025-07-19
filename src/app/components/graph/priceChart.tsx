import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  format,
  parseISO,
} from "date-fns";
import { useTranslations } from "use-intl";
import { useMediaQuery } from "react-responsive";
import { Spinner } from "@heroui/react";
import { Button } from "../button";

type HistoryTick = {
  id: number;
  price: string;
  created_at: string; // ISO string
};

type HistoryResponse = {
  period: string;
  data: HistoryTick[];
};

type ChartPoint = {
  timestamp: string;
  price: number;
};

// Утилита: сокращаем количество знаков так, чтобы общее количество цифр было не больше 4
// (примерно по условию: если двузначное число – меньше знаков после запятой и т.д.)
function formatPrice(value: number): string {
  const absVal = Math.abs(value);

  if (absVal >= 1000) {
    // 4+ знаков до запятой – округляем до целого
    return Math.round(value).toString();
  }
  if (absVal >= 100) {
    // 3 знака до запятой – оставляем 1 знак после запятой
    return value.toFixed(1);
  }
  if (absVal >= 10) {
    // 2 знака до запятой – оставляем 2 знака после запятой
    return value.toFixed(2);
  }
  if (absVal >= 1) {
    // 1 знак до запятой – оставляем 3 знака после запятой
    return value.toFixed(3);
  }
  // Меньше 1 – оставляем 4 знака после запятой
  return value.toFixed(4);
}

// Для мобильных устройств уменьшаем количество знаков после запятой для вывода.
function formatPriceMobile(value: number): string {
  const absVal = Math.abs(value);

  if (absVal >= 100) {
    // 3+ знаков до запятой – округляем до целого
    return Math.round(value).toString();
  }
  // Иначе – оставляем 1 знак после запятой
  return value.toFixed(1);
}

function PriceChart() {
  const t = useTranslations();
  // Изменяем период на те, что поддерживаются бэкендом
  const [period, setPeriod] = useState<"hour" | "day" | "7days">("day");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeY, setActiveY] = useState<number | null>(null);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => {
    if (e && e.activePayload && e.activePayload[0]) {
      const y = e.activePayload[0].payload.price;
      setActiveY(y);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Используем новый эндпоинт /history с нужным параметром периода
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/prices/history?period=${period}`);
        const response: HistoryResponse = await res.json();
        
        // Преобразуем данные в формат для графика
        const formattedData = response.data.map(item => ({
          timestamp: item.created_at,
          price: Number(item.price)
        }));
        
        // Сортируем по времени (хотя бэкенд должен уже это сделать)
        formattedData.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching price history data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  const formatXAxis = (timestamp: string) => {
    const date = parseISO(timestamp);
    switch (period) {
      case "hour":
        return format(date, "HH:mm");
      case "day":
        return format(date, "dd.MM");
      case "7days":
        return format(date, "dd.MM.yy");
      default:
        return format(date, "dd.MM HH:mm");
    }
  };

  const calculateYAxisWidth = (data: ChartPoint[]) => {
    const maxLength = Math.max(
      ...data.map(({ price }) => {
        const formattedPrice = isMobile
          ? formatPriceMobile(price)
          : formatPrice(price);
        return formattedPrice.length;
      }),
    );
    return maxLength * 8 + 20; // 8 пикселей на символ (можно настроить) + отступ
  };

  // Если данных нет после загрузки, показываем заглушку
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  // Рендерим график в любом случае, а для лоадинга используем оверлей
  return (
    <>
      <div className="text-xl font-bold sm:ml-20 ml-5 mb-1">DEF / USDT</div>
      <div className="chart-container w-full relative">
        <div className="transition-all duration-300">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart
              data={chartData}
              onMouseMove={handleMouseMove}
              margin={{ top: 20, right: 0, left: 0, bottom: 1 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
                minTickGap={20}
              />
              <YAxis
                width={calculateYAxisWidth(chartData)}
                tickMargin={10}
                tick={{ fontSize: 12 }}
                // Отображаем USDT с учётом наших форматирующих функций
                tickFormatter={(val) =>
                  isMobile ? formatPriceMobile(val) : formatPrice(val)
                }
              />
              {activeY !== null && (
                <ReferenceLine
                  y={activeY}
                  stroke="black" // Яркий красный цвет для теста
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  // Remove zIndex property to fix the linter error
                />
              )}
              <Tooltip
                itemStyle={{
                  border: "none",
                }}
                wrapperStyle={{
                  border: "none",
                }}
                contentStyle={{
                  border: "1px dashed #f0f0f0",
                  borderRadius: "10px",
                  background: "rgb(255, 255, 255, 0.8)",
                  fontSize: "9pt",
                }}
                cursor={{
                  strokeDasharray: "3 3",
                  stroke: "black",
                  type: "vertical",
                }}
                labelFormatter={(label) =>
                  format(parseISO(label), "dd.MM.yyyy HH:mm:ss")
                }
                formatter={(val) => [`${formatPrice(Number(val))} USDT`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#a855f7" // фиолетовый
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        <div className="flex justify-end mr-6 space-x-2">
          {[
            { value: "hour", label: t("PAGE_CHART_INTERVAL_1H") },
            { value: "day", label: t("PAGE_CHART_INTERVAL_1D") },
            { value: "7days", label: t("PAGE_CHART_INTERVAL_1W") }
          ].map((option) =>
            period === option.value ? (
              <Button
                key={`${option.value}_blocked`}
                className="px-3 bg-gray-700 py-1 text-sm font-bold border border-gray-300 rounded
                        hover:bg-gray-100 hover:cursor-pointer"
              >
                {option.label}
              </Button>
            ) : (
              <Button
                plain
                key={option.value}
                onClick={() => setPeriod(option.value as "hour" | "day" | "7days")}
                className="px-3 py-1 text-sm font-bold border border-gray-300 rounded
                        hover:bg-gray-100 hover:cursor-pointer"
              >
                {option.label}
              </Button>
            ),
          )}
        </div>
      </div>
    </>
  );
}

export default PriceChart;
