/**
 * @swagger
 * /api/users/test:
 *   get:
 *     summary: Check if a nickname is already in use
 *     description: Returns whether the given nickname is already taken.
 *     parameters:
 *       - name: nickname
 *         in: query
 *         required: true
 *         description: Nickname to check for duplication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nickname availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickname:
 *                   type: string
 *                 is_duplicate:
 *                   type: boolean
 */
export function test(req, res) {
    const { nickname } = req.query;
    const isDuplicate = nickname === "testUser"; // 예제 로직

    res.json({ nickname, is_duplicate: isDuplicate });
}
