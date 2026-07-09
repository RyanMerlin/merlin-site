import { useState } from 'react';

/**
 * EdgePlaneSchematic — an interactive engineering schematic of the EdgePlane
 * control plane. A hexagonal agent mesh around a central control-plane core
 * (echoing the logo). Hovering or focusing a pattern lights up the part of the
 * fleet it governs. SSR-rendered so all content is present without JS; the
 * entrance + flow animations are CSS-only and respect prefers-reduced-motion.
 */

type Kind = 'core' | 'spoke' | 'perim' | 'node';

interface Pattern {
	id: string;
	label: string;
	desc: string;
	core: boolean;
	spokes: number[];
	perim: number[];
	nodes: number[];
}

// Hexagon mesh: center core at (190,175), six agent nodes on R=120.
const CORE = { x: 190, y: 175 };
const NODES = [
	{ x: 310, y: 175, c: 'o' },
	{ x: 250, y: 71, c: 'o' },
	{ x: 130, y: 71, c: 'b' },
	{ x: 70, y: 175, c: 'b' },
	{ x: 130, y: 279, c: 'b' },
	{ x: 250, y: 279, c: 'o' },
];
// Perimeter edges connect consecutive nodes; index i joins node i and i+1.
const PERIM = NODES.map((_, i) => [i, (i + 1) % NODES.length] as const);

const PATTERNS: Pattern[] = [
	{
		id: 'control-plane',
		label: 'A control plane, not a pipeline',
		desc: 'A coordination layer that owns identity, desired state, and health, kept separate from the agents doing the work.',
		core: true, spokes: [0, 1, 2, 3, 4, 5], perim: [], nodes: [],
	},
	{
		id: 'sessions',
		label: 'Persistent sessions as the unit of work',
		desc: 'Each agent is an addressable, resumable principal: steerable mid-task, attachable live, restartable without losing its place.',
		core: false, spokes: [], perim: [], nodes: [0, 1, 2, 3, 4, 5],
	},
	{
		id: 'overlap',
		label: 'Overlap detection before work begins',
		desc: 'A similarity pass runs against the mission before a task is created, so two agents never duplicate findings or collide on the same file.',
		core: false, spokes: [], perim: [1], nodes: [1, 2],
	},
	{
		id: 'ownership',
		label: 'Durable ownership that survives crashes',
		desc: 'Every task carries a stable owner identity, not a session that evaporates, so a recovered agent resumes exactly where it stopped.',
		core: true, spokes: [0], perim: [], nodes: [0],
	},
	{
		id: 'publication',
		label: 'A governed publication path',
		desc: 'Work moves from working state to operational state to a committed memory of record, with the full chain of custody preserved.',
		core: true, spokes: [5], perim: [], nodes: [5],
	},
	{
		id: 'mission-task',
		label: 'Missions accumulate, tasks complete',
		desc: 'A mission is a perpetual coordination scope; a task is the unit of completion. The CLI and node daemon mirror kubectl and kubelet.',
		core: false, spokes: [], perim: [0, 1, 2, 3, 4, 5], nodes: [0, 1, 2, 3, 4, 5],
	},
];

export default function EdgePlaneSchematic() {
	const [active, setActive] = useState<number | null>(null);
	const p = active === null ? null : PATTERNS[active];

	const state = (kind: Kind, idx: number): 'base' | 'on' | 'off' => {
		if (!p) return 'base';
		const on =
			kind === 'core' ? p.core :
			kind === 'spoke' ? p.spokes.includes(idx) :
			kind === 'perim' ? p.perim.includes(idx) :
			p.nodes.includes(idx);
		return on ? 'on' : 'off';
	};

	return (
		<div className="ep" data-focused={p ? '' : undefined}>
			<style>{CSS}</style>

			<div className="ep-head">
				<span className="ep-dot" /> EdgePlane · how the fleet runs
			</div>

			<svg className="ep-svg" viewBox="0 0 380 360" role="img"
				aria-label="Schematic of the EdgePlane control plane: a hexagonal mesh of agents around a central control-plane core.">
				<text className="ep-anno" x="190" y="34" textAnchor="middle">CONTROL&#8202;PLANE</text>
				<text className="ep-anno ep-anno-sub" x="190" y="50" textAnchor="middle">identity · state · health</text>

				{/* spokes: core -> node */}
				{NODES.map((n, i) => (
					<line key={`s${i}`} className={`ep-seg ep-${state('spoke', i)}`}
						style={{ ['--d' as string]: `${i * 60}ms` }}
						x1={CORE.x} y1={CORE.y} x2={n.x} y2={n.y} pathLength={1} />
				))}
				{/* perimeter edges */}
				{PERIM.map(([a, b], i) => (
					<line key={`p${i}`} className={`ep-seg ep-perim ep-${state('perim', i)}`}
						style={{ ['--d' as string]: `${360 + i * 60}ms` }}
						x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} pathLength={1} />
				))}

				{/* core ring */}
				<circle className="ep-halo" cx={CORE.x} cy={CORE.y} r={22} />
				<circle className={`ep-core ep-${state('core', 0)}`} cx={CORE.x} cy={CORE.y} r={22} />
				<circle className={`ep-core-in ep-${state('core', 0)}`} cx={CORE.x} cy={CORE.y} r={8} />

				{/* agent nodes */}
				{NODES.map((n, i) => (
					<circle key={`n${i}`} className={`ep-node ep-${n.c} ep-${state('node', i)}`}
						style={{ ['--d' as string]: `${720 + i * 70}ms` }}
						cx={n.x} cy={n.y} r={9} />
				))}

				<text className="ep-anno" x="190" y="330" textAnchor="middle">EXECUTION · AGENTS</text>
			</svg>

			<ul className="ep-list">
				{PATTERNS.map((pat, i) => (
					<li key={pat.id}>
						<button type="button"
							className={`ep-item ${active === i ? 'ep-item-on' : ''}`}
							aria-pressed={active === i}
							onMouseEnter={() => setActive(i)}
							onMouseLeave={() => setActive(null)}
							onFocus={() => setActive(i)}
							onBlur={() => setActive(null)}
							onClick={() => setActive(active === i ? null : i)}>
							<span className="ep-item-label">{pat.label}</span>
							<span className="ep-item-desc">{pat.desc}</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

const CSS = `
.ep {
	--ep-blue: var(--color-link);
	--ep-orange: var(--color-accent);
	--ep-edge: color-mix(in srgb, var(--color-text-muted) 55%, transparent);
	--ep-ring: var(--color-text);
	margin-top: 1.25rem;
}
.ep-head {
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--color-text-muted);
	display: flex; align-items: center; gap: 0.5rem;
	padding-bottom: 0.75rem;
	border-bottom: 1px dashed var(--color-border);
}
.ep-dot {
	width: 7px; height: 7px; border-radius: 50%;
	background: var(--ep-orange);
	box-shadow: 0 0 0 0 color-mix(in srgb, var(--ep-orange) 60%, transparent);
	animation: ep-beacon 2.6s ease-out infinite;
}
.ep-svg { display: block; width: 100%; max-width: 460px; height: auto; margin: 0.5rem auto 0; }

.ep-anno {
	font-family: var(--font-mono);
	font-size: 11px; letter-spacing: 0.22em;
	fill: var(--color-text-muted); text-transform: uppercase;
}
.ep-anno-sub { font-size: 9px; letter-spacing: 0.08em; opacity: 0.7; text-transform: none; }

/* edges */
.ep-seg {
	stroke: var(--ep-edge); stroke-width: 1.4; stroke-linecap: round;
	stroke-dasharray: 1; stroke-dashoffset: 1;
	animation: ep-draw 0.85s ease forwards; animation-delay: var(--d, 0ms);
}
.ep-perim { stroke-dasharray: 1; }

/* core */
.ep-core { fill: none; stroke: var(--ep-ring); stroke-width: 2.5; opacity: 0; animation: ep-fade 0.6s ease 0.3s forwards; transition: stroke 0.25s, opacity 0.25s; }
.ep-core-in { fill: var(--ep-ring); opacity: 0; animation: ep-fade 0.6s ease 0.4s forwards; transition: opacity 0.25s; }
.ep-halo { fill: none; stroke: var(--ep-ring); stroke-width: 2.5; opacity: 0; transform-box: fill-box; transform-origin: center; animation: ep-breathe 3.4s ease-in-out 1.1s infinite; }

/* nodes */
.ep-node {
	opacity: 0; transform: scale(0.3); transform-box: fill-box; transform-origin: center;
	animation: ep-pop 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) forwards; animation-delay: var(--d, 0ms);
	transition: opacity 0.25s, filter 0.25s, r 0.2s;
}
.ep-b { fill: var(--ep-blue); }
.ep-o { fill: var(--ep-orange); }

/* focus states: dim everything, then light the governed parts */
.ep[data-focused] .ep-seg.ep-off,
.ep[data-focused] .ep-node.ep-off { opacity: 0.16; }
.ep[data-focused] .ep-core.ep-off, .ep[data-focused] .ep-core-in.ep-off { opacity: 0.18; }

.ep-seg.ep-on { stroke: var(--color-accent); stroke-width: 2.2; opacity: 1;
	stroke-dasharray: 5 5; animation: ep-flow 0.7s linear infinite; }
.ep-node.ep-on { filter: drop-shadow(0 0 6px color-mix(in srgb, currentColor 80%, transparent)); }
.ep-node.ep-on.ep-b { fill: var(--ep-blue); }
.ep-core.ep-on { stroke: var(--color-accent); stroke-width: 3; }
.ep-core-in.ep-on { fill: var(--color-accent); }

/* pattern list */
.ep-list { list-style: none; margin: 1.25rem 0 0; padding: 0; display: grid; gap: 0.25rem; }
.ep-item {
	width: 100%; text-align: left; display: block; cursor: pointer;
	background: none; border: 0; border-left: 2px solid transparent;
	padding: 0.5rem 0.75rem; border-radius: 0 4px 4px 0;
	transition: background 0.2s, border-color 0.2s;
}
.ep-item:hover, .ep-item-on { background: var(--color-bg-subtle); border-left-color: var(--color-accent); }
.ep-item:focus-visible { outline: 2px solid var(--color-link); outline-offset: 2px; }
.ep-item-label { display: block; font-weight: 600; color: var(--color-text); font-size: 0.96rem; }
.ep-item-desc { display: block; margin-top: 0.15rem; font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5; }

@keyframes ep-draw { to { stroke-dashoffset: 0; } }
@keyframes ep-fade { to { opacity: 1; } }
@keyframes ep-pop { to { opacity: 1; transform: scale(1); } }
@keyframes ep-flow { to { stroke-dashoffset: -10; } }
@keyframes ep-breathe { 0%, 100% { opacity: 0.16; transform: scale(1); } 50% { opacity: 0.34; transform: scale(1.5); } }
@keyframes ep-beacon {
	0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ep-orange) 55%, transparent); }
	70%, 100% { box-shadow: 0 0 0 7px transparent; }
}

@media (prefers-reduced-motion: reduce) {
	.ep-seg { stroke-dashoffset: 0; animation: none; }
	.ep-seg.ep-on { stroke-dasharray: none; animation: none; }
	.ep-node { opacity: 1; transform: none; animation: none; }
	.ep-core, .ep-core-in { opacity: 1; animation: none; }
	.ep-halo { display: none; }
	.ep-dot { animation: none; }
}
`;
