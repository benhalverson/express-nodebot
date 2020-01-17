const { Board, Motor } = require('johnny-five');

const board = new Board();

const express = require('express');

const router = express.Router();
// board.on("ready", () => {
//   // Create a new `motor` hardware instance.
//   const motor = new Motor({
//     // pins: [4, 5],
//     // pins: [8, 9, 10],
//     pins: [4, 5, 6],
//     controller: "PCA9685",
//     address: 0x41
//   });
// }


router.get('/:speed', (req, res) => {
  const speed = req.params.id;
  // const motor = new five.Motor();
  res.json({
    speed,
  });

  board.on('ready', () => {
  // Create a new `motor` hardware instance.
    const motor = new Motor({
    // pins: [4, 5],
    // pins: [8, 9, 10],
      pins: [4, 5, 6],
      controller: 'PCA9685',
      address: 0x41,
    });
  });
  motor.forward(speed); // number should come from frontend...
});

module.exports = router;
