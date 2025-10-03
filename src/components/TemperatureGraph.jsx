import React, { useState, useRef } from "react";
import "./TemperatureGraph.css";

const TemperatureGraph = ({ weatherData }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const graphRef = useRef(null);

  if (!weatherData || !weatherData.daily) {
    return <div className="temperature-graph">Loading temperature data...</div>;
  }

  const { time, temperature_2m_max, temperature_2m_min } = weatherData.daily;

  // Prepare data for the graph (limit to 7 days)
  const data = time.slice(0, 7).map((date, index) => ({
    date,
    maxTemp: temperature_2m_max[index],
    minTemp: temperature_2m_min[index],
  }));

  // Find the overall min and max temperatures for scaling
  // Find the overall min and max temperatures for scaling
  const allTemps = [
    ...temperature_2m_max.slice(0, 7),
    ...temperature_2m_min.slice(0, 7),
  ];
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);

  // Add padding
  const adjustedMin = globalMin - 2;
  const adjustedMax = globalMax + 2;
  const tempRange = adjustedMax - adjustedMin;

  // Scaling function (same as for points)
  const scaleY = (temp) => 100 - ((temp - adjustedMin) / tempRange) * 90 - 2; // keep top/bottom padding

  // Grid lines aligned with adjusted labels
  const gridLines = [
    { label: Math.round(adjustedMax), y: scaleY(adjustedMax) },
    {
      label: Math.round((adjustedMax + adjustedMin) / 2),
      y: scaleY((adjustedMax + adjustedMin) / 2),
    },
    { label: Math.round(adjustedMin), y: scaleY(adjustedMin) },
  ];
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Handle mouse movement for hover effect
  const handlePointHover = (e, point, type) => {
    if (graphRef.current) {
      const rect = graphRef.current.getBoundingClientRect();
      setHoverPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setHoveredPoint({ ...point, type });
  };

  // Calculate point positions
  const calculatePointPosition = (temp, index) => {
    const y = scaleY(temp);
    const x = 3 + (index / (data.length - 1)) * 90; // add horizontal padding
    return { x, y };
  };

  // Create a smooth curve using cubic bezier
  const createSmoothPath = (points) => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];

      const controlPoint1 = {
        x: p0.x + (p1.x - (i > 1 ? points[i - 2].x : p0.x)) / 2,
        y: p0.y,
      };

      const controlPoint2 = {
        x: p1.x - (p1.x - p0.x) / 2,
        y: p1.y,
      };

      path += ` C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${p1.x} ${p1.y}`;
    }

    return path;
  };

  const maxPoints = data.map((day, index) =>
    calculatePointPosition(day.maxTemp, index)
  );
  const minPoints = data.map((day, index) =>
    calculatePointPosition(day.minTemp, index)
  );

  return (
    <div className="temperature-graph">
      <h3>Temperature Trends</h3>

      <div className="graph-container" ref={graphRef}>
        <div className="y-axis">
          {gridLines.map((line, i) => (
            <span key={i}>{line.label}°</span>
          ))}
        </div>

        <div className="graph-content">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Dynamic grid lines */}
            {gridLines.map((line) => (
              <line
                key={line.label}
                x1="0"
                x2="100"
                y1={line.y}
                y2={line.y}
                className="grid-line"
              />
            ))}

            {/* Max temperature line */}
            <path
              d={createSmoothPath(maxPoints)}
              className="line max-temp-line"
              fill="none"
            />

            {/* Min temperature line */}
            <path
              d={createSmoothPath(minPoints)}
              className="line min-temp-line"
              fill="none"
            />

            {/* Max points */}
            {data.map((day, index) => {
              const { x, y } = maxPoints[index];
              return (
                <circle
                  key={`max-${day.date}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  className="point max-temp-point"
                  onMouseEnter={(e) => handlePointHover(e, day, "max")}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}

            {/* Min points */}
            {data.map((day, index) => {
              const { x, y } = minPoints[index];
              return (
                <circle
                  key={`min-${day.date}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  className="point min-temp-point"
                  onMouseEnter={(e) => handlePointHover(e, day, "min")}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="x-axis">
            {data.map((day, index) => (
              <div
                key={day.date}
                className="day-label"
                style={{ left: `${(index / (data.length - 1)) * 100}%` }}
              >
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>
            ))}
          </div>
        </div>

        {hoveredPoint && (
          <div
            className="tooltip"
            style={{
              left: `${hoverPosition.x + 10}px`,
              top: `${hoverPosition.y + 10}px`,
            }}
          >
            <div className="tooltip-date">{formatDate(hoveredPoint.date)}</div>
            <div className="tooltip-temp">
              <span
                className={`max ${hoveredPoint.type === "max" ? "active" : ""}`}
              >
                Max: {Math.round(hoveredPoint.maxTemp)}°
              </span>
              <span
                className={`min ${hoveredPoint.type === "min" ? "active" : ""}`}
              >
                Min: {Math.round(hoveredPoint.minTemp)}°
              </span>
            </div>
            <div className="tooltip-type">
              {hoveredPoint.type === "max" ? "Maximum" : "Minimum"} Temperature
            </div>
          </div>
        )}
      </div>

      <div className="graph-legend">
        <div className="legend-item">
          <div className="color-indicator max-temp"></div>
          <span>Maximum Temperature</span>
        </div>
        <div className="legend-item">
          <div className="color-indicator min-temp"></div>
          <span>Minimum Temperature</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGraph;
