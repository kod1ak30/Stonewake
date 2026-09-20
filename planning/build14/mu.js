function mu({ kind: e, state: t, act: n, busy: r }) {
  let i = el(t, e),
    a = t.trainingResearch,
    o = tl(t, e);
  return (0, F.jsxs)(`div`, {
    className: `troop-research`,
    children: [
      (0, F.jsxs)(`span`, {
        children: [
          `Level `,
          i,
          ` / 10 · `,
          Math.round(J[e].hp * (1 + 0.16 * (i - 1))),
          ` health · `,
          Math.round((J[e].heal || J[e].damage) * (1 + 0.14 * (i - 1))),
          J[e].heal ? ` healing per cast` : ` attack`,
        ],
      }),
      a?.kind === e
        ? (0, F.jsxs)(`strong`, {
            children: [
              (0, F.jsx)(k, { size: 13 }),
              `Upgrade ready in `,
              Qc((a.readyAt - Date.now()) / 1e3),
            ],
          })
        : i < 10
          ? (0, F.jsxs)(F.Fragment, {
              children: [
                (0, F.jsx)(cu, { cost: o }),
                (0, F.jsx)(`button`, {
                  className: `text-button`,
                  disabled:
                    r || !!a || i >= Ml(t) || Ml(t) < J[e].unlock || !Z(t, o),
                  onClick: () =>
                    void n(
                      { type: `researchUnit`, kind: e },
                      `Troop upgrade started`,
                    ),
                  children:
                    Ml(t) < J[e].unlock
                      ? `Unlock at Keep ${J[e].unlock}`
                      : i >= Ml(t)
                        ? `Keep ${i + 1} to upgrade`
                        : a
                          ? `Research in progress`
                          : `Upgrade to level ${i + 1} · ${Qc(120 * 1.7 ** (i - 1))}`,
                }),
              ],
            })
          : (0, F.jsxs)(`strong`, {
              children: [(0, F.jsx)(oe, { size: 14 }), `Mastered`],
            }),
    ],
  });
}