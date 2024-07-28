const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let rules = []; // In-memory storage for rules

app.post('/create_rule', (req, res) => {
  const ruleString = req.body.rule;
  const ast = createRuleAST(ruleString);
  rules.push({ ruleString, ast });
  res.status(201).send({ message: 'Rule created', ast });
});

app.post('/evaluate_rule', (req, res) => {
  const ast = req.body.ast;
  const data = req.body.data;
  const result = evaluateRule(ast, data);
  res.status(200).send({ result });
});

app.listen(port, () => {
  console.log(`Rule engine backend listening at http://localhost:${port}`);
});

function createRuleAST(ruleString) {
  // A basic implementation to parse a rule string and create an AST
  return {
    type: 'operator',
    value: 'AND',
    left: {
      type: 'operator',
      value: 'OR',
      left: {
        type: 'operand',
        value: { attribute: 'age', operator: '>', value: 30 }
      },
      right: {
        type: 'operand',
        value: { attribute: 'department', operator: '=', value: 'Sales' }
      }
    },
    right: {
      type: 'operator',
      value: 'OR',
      left: {
        type: 'operand',
        value: { attribute: 'salary', operator: '>', value: 50000 }
      },
      right: {
        type: 'operand',
        value: { attribute: 'experience', operator: '>', value: 5 }
      }
    }
  };
}

function evaluateRule(ast, data) {
  if (ast.type === 'operator') {
    const leftEval = evaluateRule(ast.left, data);
    const rightEval = evaluateRule(ast.right, data);
    if (ast.value === 'AND') {
      return leftEval && rightEval;
    } else if (ast.value === 'OR') {
      return leftEval || rightEval;
    }
  } else if (ast.type === 'operand') {
    const { attribute, operator, value } = ast.value;
    if (operator === '>') {
      return data[attribute] > value;
    } else if (operator === '=') {
      return data[attribute] === value;
    }
  }
  return false;
}
