import React from 'react';

const ColorGrid = ({ gridData }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(25, 20px)',
      gap: '1px',
      border: '1px solid #ddd'
    }}>
      {gridData.map((row, rowIndex) => (
        row.map((color, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: color || '#ffffff', // Default to white if undefined
            }}
          />
        ))
      ))}
    </div>
  );
};

export default ColorGrid;
