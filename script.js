window.onload = function () {
  const canvas = document.getElementById("simulationCanvas");
  const ctx = canvas.getContext("2d");
  const startButton = document.getElementById("startButton");

  startButton.addEventListener("click", function () {
    const velocityInput = document.getElementById("velocity").value;
    const angleInput = document.getElementById("angle").value;

    const initialVelocity = parseFloat(velocityInput);
    const angleInDegrees = parseFloat(angleInput);

    if (isNaN(initialVelocity) || isNaN(angleInDegrees)) {
      alert("Please enter valid numbers for velocity and angle.");
      return;
    }

    simulateProjectile(initialVelocity, angleInDegrees);
  });

  function simulateProjectile(initialVelocity, angleInDegrees) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const gravity = 9.81; // m/s^2

    const totalTime =
      (2 * initialVelocity * Math.sin(angleInRadians)) / gravity;
    const timeIncrement = 0.02;
    let time = 0;

    const positions = [];

    // Calculate positions
    while (time <= totalTime) {
      const x = initialVelocity * Math.cos(angleInRadians) * time;
      const y =
        initialVelocity * Math.sin(angleInRadians) * time -
        0.5 * gravity * time * time;
      positions.push({ x: x, y: y });
      time += timeIncrement;
    }

    // Scale positions to fit canvas
    const scaleFactorX = canvas.width / positions[positions.length - 1].x;
    const scaleFactorY =
      canvas.height / (Math.max(...positions.map((p) => p.y)) + 10);

    let index = 0;

    function animate() {
      if (index >= positions.length) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#654321";
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

      // Draw projectile path
      ctx.beginPath();
      ctx.moveTo(
        positions[0].x * scaleFactorX,
        canvas.height - positions[0].y * scaleFactorY
      );
      for (let i = 1; i <= index; i++) {
        ctx.lineTo(
          positions[i].x * scaleFactorX,
          canvas.height - positions[i].y * scaleFactorY
        );
      }
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      // Draw projectile
      ctx.beginPath();
      ctx.arc(
        positions[index].x * scaleFactorX,
        canvas.height - positions[index].y * scaleFactorY,
        5,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "#ff6f61";
      ctx.fill();

      index++;
      requestAnimationFrame(animate);
    }

    animate();
  }
};
