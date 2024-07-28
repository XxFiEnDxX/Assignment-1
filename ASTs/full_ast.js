function tokenize(input) {
    const tokens = [];
    const regex = /\bAND\b|\bOR\b|>=|<=|>|<|=|\(|\)|\b[a-zA-Z_]\w*|\'[^\']*\'|\d+/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
      tokens.push(match[0]);
    }
    return tokens;
  }
  
  function parse(tokens) {
    let position = 0;
  
    function peek() {
      return tokens[position];
    }
  
    function consume() {
      return tokens[position++];
    }
  
    function parsePrimary() {
      const token = consume();
      if (token === '(') {
        const expr = parseExpression();
        consume(); // consume ')'
        return expr;
      } else if (/\d+/.test(token)) {
        return { type: 'Literal', value: parseInt(token, 10) };
      } else if (/\'[^\']*\'/.test(token)) {
        return { type: 'Literal', value: token.slice(1, -1) }; // remove quotes
      } else {
        return { type: 'Identifier', name: token };
      }
    }
  
    function parseComparison() {
      let left = parsePrimary();
      const operator = consume();
      const right = parsePrimary();
      return { type: 'Comparison', operator, left, right };
    }
  
    function parseLogicalAnd() {
      let node = parseComparison();
      while (peek() === 'AND') {
        const operator = consume();
        const right = parseComparison();
        node = { type: 'LogicalExpression', operator, left: node, right };
      }
      return node;
    }
  
    function parseLogicalOr() {
      let node = parseLogicalAnd();
      while (peek() === 'OR') {
        const operator = consume();
        const right = parseLogicalAnd();
        node = { type: 'LogicalExpression', operator, left: node, right };
      }
      return node;
    }
  
    function parseExpression() {
      return parseLogicalOr();
    }
  
    return parseExpression();
  }
  
  function create_rule(rule_string) {
    const tokens = tokenize(rule_string);
    return parse(tokens);
  }
  
  function combine_rules(rules) {
    if (rules.length === 0) return null;
  
    const asts = rules.map(rule => create_rule(rule));
  
    if (asts.length === 1) return asts[0];
  
    let combinedAst = asts[0];
    for (let i = 1; i < asts.length; i++) {
      combinedAst = {
        type: 'LogicalExpression',
        operator: 'AND',
        left: combinedAst,
        right: asts[i]
      };
    }
  
    return combinedAst;
  }
  
  function evaluate_node(node, data) {
    switch (node.type) {
      case 'Literal':
        return node.value;
      case 'Identifier':
        return data[node.name];
      case 'Comparison':
        const leftValue = evaluate_node(node.left, data);
        const rightValue = evaluate_node(node.right, data);
        console.log(node.operator);
        switch (node.operator) {
          case '>':
            return leftValue > rightValue;
          case '<':
            return leftValue < rightValue;
          case '>=':
            return leftValue >= rightValue;
          case '<=':
            return leftValue <= rightValue;
          case '=':
            return leftValue === rightValue;
          default:
            throw new Error(`Unknown operator: ${node.operator}`);
        }
      case 'LogicalExpression':
        const leftEval = evaluate_node(node.left, data);
        const rightEval = evaluate_node(node.right, data);
        switch (node.operator) {
          case 'AND':
            return leftEval && rightEval;
          case 'OR':
            return leftEval || rightEval;
          default:
            throw new Error(`Unknown operator: ${node.operator}`);
        }
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
  
  function evaluate_rule(json_data, data) {
    const ast = JSON.parse(json_data);
    return evaluate_node(ast, data);
  }
  
  // Example usage
  const rule1 = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
  const rule2 = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";
  
  const ast1 = create_rule(rule1);
  const ast2 = create_rule(rule2);

  console.log(JSON.stringify(ast1, null, 2));
  console.log(JSON.stringify(ast2, null, 2));

const combinedAst = combine_rules([rule1, rule2]);
//   console.log(JSON.stringify(combinedAst, null, 2));
  const combinedAstJson = JSON.stringify(combinedAst);

//   console.log(combinedAstJson);
  
  const data = {
    age: 35,
    department: 'Sales',
    salary: 60000,
    experience: 3
  };
  
  const result = evaluate_rule(combinedAstJson, data);
  console.log(result); // Outputs: true or false based on the evaluation
  