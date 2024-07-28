import React, { useState } from 'react';
import axios from 'axios';

const RuleForm = () => {
  const [rule, setRule] = useState('');
  const [data, setData] = useState({ age: '', department: '', salary: '', experience: '' });
  const [result, setResult] = useState(null);

  const handleRuleChange = (e) => {
    setRule(e.target.value);
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ruleResponse = await axios.post('http://localhost:3000/create_rule', { rule });
      const ast = ruleResponse.data.ast;
      const evalResponse = await axios.post('http://localhost:3000/evaluate_rule', { ast, data });
      setResult(evalResponse.data.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Rule Engine</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rule:</label>
          <input type="text" value={rule} onChange={handleRuleChange} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" name="age" value={data.age} onChange={handleDataChange} required />
        </div>
        <div>
          <label>Department:</label>
          <input type="text" name="department" value={data.department} onChange={handleDataChange} required />
        </div>
        <div>
          <label>Salary:</label>
          <input type="number" name="salary" value={data.salary} onChange={handleDataChange} required />
        </div>
        <div>
          <label>Experience:</label>
          <input type="number" name="experience" value={data.experience} onChange={handleDataChange} required />
        </div>
        <button type="submit">Evaluate</button>
      </form>
      {result !== null && <div>Result: {result ? 'Eligible' : 'Not Eligible'}</div>}
    </div>
  );
};

export default RuleForm;
