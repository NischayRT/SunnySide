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
  const allTemps = [
    ...temperature_2m_max.slice(0, 7),
    ...temperature_2m_min.slice(0, 7),
  ];
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const tempRange = globalMax - globalMin;

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
    const y = 100 - ((temp - globalMin) / tempRange) * 90; // Scale to 5-95% of container
    const x = (index / (data.length - 1)) * 100; // Distribute evenly across width
    return { x, y };
  };

  // Create a smooth curve using cubic bezier
  const createSmoothPath = (points) => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];

      // Control points for smooth curve
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

  // Generate points for max and min temperatures
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
          <span>{Math.round(globalMax)}°</span>
          <span>{Math.round((globalMax + globalMin) / 2)}°</span>
          <span>{Math.round(globalMin)}°</span>
        </div>

        <div className="graph-content">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="100" y2="0" className="grid-line" />
            <line x1="0" y1="50" x2="100" y2="50" className="grid-line" />
            <line x1="0" y1="100" x2="100" y2="100" className="grid-line" />

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

            {/* Max temperature points */}
            {data.map((day, index) => {
              const { x, y } = maxPoints[index];
              return (
                <circle
                  key={`max-${index}`}
                  cx={x}
                  cy={y}
                  r="2.5"
                  className="point max-temp-point"
                  onMouseEnter={(e) => handlePointHover(e, day, "max")}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}

            {/* Min temperature points */}
            {data.map((day, index) => {
              const { x, y } = minPoints[index];
              return (
                <circle
                  key={`min-${index}`}
                  cx={x}
                  cy={y}
                  r="2.5"
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
                key={index}
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
              <span className="max">
                Max: {Math.round(hoveredPoint.maxTemp)}°
              </span>
              <span className="min">
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
