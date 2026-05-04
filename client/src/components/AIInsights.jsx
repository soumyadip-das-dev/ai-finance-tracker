import { Card, CardContent, Typography } from "@mui/material";

const AIInsights = ({ transactions }) => {
  if (!transactions.length) return null;

  const total = transactions.reduce((s, t) => s + t.amount, 0);

  const map = {};
  transactions.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });

  let topCategory = "";
  let max = 0;
  for (let k in map) {
    if (map[k] > max) {
      max = map[k];
      topCategory = k;
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">AI Insights</Typography>
        <Typography>Total: ₹{total}</Typography>
        <Typography>
          Top Category: <b>{topCategory}</b>
        </Typography>

        {max > total * 0.4 && (
          <Typography color="warning.main">
            ⚠ High spending on {topCategory}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;