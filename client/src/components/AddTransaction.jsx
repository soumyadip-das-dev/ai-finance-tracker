import { useState } from "react";
import axios from "axios";
import { Box, TextField, MenuItem, Button } from "@mui/material";

const AddTransaction = ({ refresh }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    await axios.post("http://localhost:5000/api/transactions", {
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      type: "expense",
    });

    setForm({ title: "", amount: "", category: "Food" });
    refresh();
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 3,
        mb: 3,
      }}
    >
      <TextField
        label="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        fullWidth
      />

      <TextField
        label="Amount"
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        sx={{ width: 140 }}
      />

      <TextField
        select
        label="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        sx={{ width: 160 }}
      >
        {["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health"].map(
          (c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          )
        )}
      </TextField>

      <Button type="submit" variant="contained">
        Add
      </Button>
    </Box>
  );
};

export default AddTransaction;