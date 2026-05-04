const SummaryCards = ({ transactions }) => {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  return (
    <div className="card-container">
      <div className="card">
        <h4>Income</h4>
        <h2 className="green">₹{income}</h2>
      </div>

      <div className="card">
        <h4>Expense</h4>
        <h2 className="red">₹{expense}</h2>
      </div>

      <div className="card">
        <h4>Balance</h4>
        <h2 className="yellow">₹{balance}</h2>
      </div>
    </div>
  );
};

export default SummaryCards;