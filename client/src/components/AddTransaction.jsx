import { useState } from "react";
import axios from "../api/axios";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Other"];

const AddTransaction = ({ refresh }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || isNaN(Number(form.amount))) return;

    try {
      setSubmitting(true);
      await axios.post("/transactions", {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        type: "expense",
      });

      setForm({
        title: "",
        amount: "",
        category: "Food",
      });

      if (refresh) refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 1.5, sm: 1.5 },
        p: { xs: 2, sm: 2 },
        bgcolor: "#111827",
        border: "1px solid #1a2332",
        borderRadius: "16px",
        width: "100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <TextField
        label="Title"
        placeholder="e.g. Grocery store"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        size="small"
        fullWidth
        required
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "#0d1422",
            color: "#e2e8f0",
            borderRadius: "10px",
            "& fieldset": { borderColor: "#1a2332" },
            "&:hover fieldset": { borderColor: "#243044" },
            "&.Mui-focused fieldset": { borderColor: "#00ff88" },
          },
          "& .MuiInputLabel-root": { color: "#64748b" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#00ff88" },
        }}
      />

      <TextField
        label="Amount (₹)"
        type="number"
        placeholder="0.00"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        size="small"
        required
        sx={{
          width: { xs: "100%", sm: 130, md: 150 },
          "& .MuiOutlinedInput-root": {
            bgcolor: "#0d1422",
            color: "#e2e8f0",
            borderRadius: "10px",
            "& fieldset": { borderColor: "#1a2332" },
            "&:hover fieldset": { borderColor: "#243044" },
            "&.Mui-focused fieldset": { borderColor: "#00ff88" },
          },
          "& .MuiInputLabel-root": { color: "#64748b" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#00ff88" },
        }}
      />

      <TextField
        select
        label="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        size="small"
        sx={{
          width: { xs: "100%", sm: 140, md: 160 },
          "& .MuiOutlinedInput-root": {
            bgcolor: "#0d1422",
            color: "#e2e8f0",
            borderRadius: "10px",
            "& fieldset": { borderColor: "#1a2332" },
            "&:hover fieldset": { borderColor: "#243044" },
            "&.Mui-focused fieldset": { borderColor: "#00ff88" },
          },
          "& .MuiInputLabel-root": { color: "#64748b" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#00ff88" },
        }}
      >
        {CATEGORIES.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        startIcon={<AddRoundedIcon />}
        sx={{
          width: { xs: "100%", sm: "auto" },
          height: 40,
          whiteSpace: "nowrap",
          px: 2.5,
          borderRadius: "10px",
          bgcolor: "#00ff88",
          color: "#0a0f1a",
          fontWeight: 600,
          fontFamily: "'Sora', sans-serif",
          textTransform: "none",
          "&:hover": { bgcolor: "#00e87a" },
          "&:disabled": { bgcolor: "#334155", color: "#64748b" },
        }}
      >
        {submitting ? "Adding..." : "Add"}
      </Button>
    </Box>
  );
};

export default AddTransaction;