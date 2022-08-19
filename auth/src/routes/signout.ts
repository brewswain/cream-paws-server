import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
   //check cookie-session documentation for destroying our...well, our cookie session 🤷🏽
   req.session = null;

   res.send({});
});

export { router as signOutRouter };
