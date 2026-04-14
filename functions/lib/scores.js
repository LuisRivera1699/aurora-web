"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeScores = computeScores;
function computeScores(c) {
    let total = 0;
    const opp = c.opportunity_level === "high" ? 35 : c.opportunity_level === "medium" ? 22 : 12;
    const urg = c.urgency === "high" ? 30 : c.urgency === "medium" ? 18 : 10;
    const mat = c.maturity === "validated" ? 25 : c.maturity === "early" ? 18 : 12;
    const intentBoost = c.intent === "new_product" || c.intent === "automation" ? 10 : c.intent === "validation" ? 8 : 5;
    const recBoost = c.primary_recommendation === "build_mvp" || c.primary_recommendation === "automate"
        ? 6
        : c.primary_recommendation === "validate_first"
            ? 4
            : 0;
    total = Math.min(100, opp + urg + mat + intentBoost + recBoost);
    const bucket = total >= 72 ? "high" : total >= 45 ? "medium" : "low";
    return { total, bucket };
}
//# sourceMappingURL=scores.js.map