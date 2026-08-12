import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserService, loginUserService } from "../services/authService.js";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
export const registerUser = asyncHandler(async (req, res) => {
  const result = await registerUserService(req.body);
  res.status(201).json(result);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const result = await loginUserService(req.body);
  res.status(200).json(result);
});