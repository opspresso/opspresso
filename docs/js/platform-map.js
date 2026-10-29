/* Agent Platform map. One data model drives two SVG layouts: a wide left-to-right
   flow and a narrow top-to-bottom flow. Selecting a box highlights its links and
   explains them in the panel below. Without JavaScript the figure caption and the
   product rows still describe every service. */
(function () {
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var NARROW = window.matchMedia('(max-width: 640px)');

    // box: [x, y, width, height] in each layout's viewBox units.
    var NODES = [
        {
            id: 'channels', title: 'Entry points', outside: true,
            sub: ['Console · API · Slack', 'Teams · Telegram · Automation'], short: 'Entry points',
            box: { wide: [16, 230, 184, 64], narrow: [126, 16, 108, 56] },
            detail: 'The console, Agent API, Slack, Teams, Telegram, webhooks, and schedules start agent runs in Studio.'
        },
        {
            id: 'coding', title: 'Coding clients', outside: true,
            sub: ['Claude Code · Codex'], short: 'Coding clients',
            box: { wide: [16, 46, 184, 64], narrow: [8, 16, 108, 56] },
            detail: 'Claude Code and Codex connect to Memory directly with a personal client credential and the owner’s current permissions.'
        },
        {
            id: 'plugins', title: 'agent-plugins', outside: true,
            sub: ['Skills · MCP declarations'], short: 'agent-plugins',
            box: { wide: [16, 414, 184, 64], narrow: [244, 16, 108, 56] },
            href: 'https://github.com/opspresso/agent-plugins', linkText: 'Open on GitHub',
            detail: 'A public repository of task-focused plugins, Agent Skills, and MCP declarations. Studio syncs it. It runs no service of its own.'
        },
        {
            id: 'studio', title: 'Agent Studio', product: true,
            sub: ['Identity · agents', 'MCP orchestration'], short: 'Agent Studio',
            box: { wide: [256, 200, 208, 124], narrow: [84, 124, 232, 84] },
            href: '#agent-studio',
            detail: 'Owns agent configuration, conversations, run traces, and execution policy. Provides OIDC identity for the platform and connects to Memory, Knowledge, Forge, and Delivery through MCP. Each service owns its console, data, settings, and approvals.'
        },
        {
            id: 'memory', title: 'Agent Memory', product: true,
            sub: ['Durable context', 'and handoffs'], short: 'Memory',
            box: { wide: [552, 36, 208, 84], narrow: [8, 268, 78, 76] },
            href: '#agent-memory',
            detail: 'Stores rules, preferences, decisions, facts, and lessons with their sources and versions. Studio agents and coding clients recall them and hand work between sessions.'
        },
        {
            id: 'knowledge', title: 'Agent Knowledge', product: true,
            sub: ['Documents, audio,', 'and knowledge'], short: 'Knowledge',
            box: { wide: [552, 196, 208, 84], narrow: [100, 268, 78, 76] },
            href: '#agent-knowledge',
            detail: 'Owns documents, recordings, transcripts, meeting notes, and source-linked knowledge. Its console manages audio profiles and processing history; retrieval respects source permissions. Model calls go through Models.'
        },
        {
            id: 'forge', title: 'Agent Forge', product: true,
            sub: ['Workspaces', 'and sandboxes'], short: 'Forge',
            box: { wide: [552, 372, 208, 84], narrow: [186, 268, 78, 76] },
            href: '#agent-forge',
            detail: 'Owns persistent workspaces, execution profiles, GitHub connections, and protected Git approvals. Runs commands and coding CLIs in isolated sandboxes, routes model calls through Models, and receives development values from Delivery.'
        },
        {
            id: 'delivery', title: 'Agent Delivery', product: true,
            sub: ['Resources · secrets', 'build · deploy · promote'], short: 'Delivery',
            box: { wide: [552, 532, 208, 84], narrow: [274, 268, 78, 76] },
            href: '#agent-delivery',
            detail: 'Applies application.yaml, provisions app resources, and delivers secrets. Owns releases, deployment approvals, logs, environment promotion, and rollback. Argo Workflows builds and tests; GitOps deploys the release. Secret values stay outside MCP responses.'
        },
        {
            id: 'sandbox', title: 'Sandboxes', outside: true,
            sub: ['Docker · Kubernetes'], short: 'Sandboxes',
            box: { wide: [840, 388, 184, 52], narrow: [186, 400, 78, 56] },
            detail: 'Docker or Kubernetes sandboxes. Each run gets a gateway token limited to that run, so a sandbox never calls Models directly. Dev values from Agent Delivery are masked in run output.'
        },
        {
            id: 'models', title: 'Agent Models', product: true,
            sub: ['Approve · route', 'record usage'], short: 'Agent Models',
            box: { wide: [840, 184, 184, 110], narrow: [8, 400, 170, 80] },
            href: '#agent-models',
            detail: 'Holds provider connections and keys. Only models an operator approves can be called. Each request’s usage and cost is recorded once, without storing generated content.'
        },
        {
            id: 'providers', title: 'Model providers', outside: true,
            sub: ['OpenAI · Anthropic', 'Google · xAI · Bedrock', 'OpenRouter · Self-hosted'],
            subNarrow: ['OpenAI · Anthropic', 'Google · xAI · Bedrock', 'OpenRouter · Self-hosted'],
            box: { wide: [840, 24, 184, 112], narrow: [8, 528, 170, 84] },
            detail: 'OpenAI, Anthropic, Google, xAI, Amazon Bedrock, OpenRouter, and self-hosted endpoints, connected once in Models.'
        },
        {
            id: 'resources', title: 'App resources', outside: true,
            sub: ['PostgreSQL pool · S3 prefix', 'SSM Parameter Store'], short: 'Resources',
            box: { wide: [840, 526, 184, 96], narrow: [274, 400, 78, 56] },
            detail: 'A database and login role on the shared PostgreSQL pool, a private prefix in a shared S3 bucket, and secret values in SSM Parameter Store. Each belongs to one project environment.'
        },
        {
            id: 'apps', title: 'Deployed apps', outside: true,
            sub: ['Release · environment', 'GitOps · External Secrets'], short: 'Deployed apps',
            box: { wide: [840, 666, 184, 64], narrow: [186, 592, 166, 68] },
            detail: 'GitOps declares the release for each project environment. Delivery tracks deployment results, promotes the same image digest, and can roll back to a previous release. External Secrets supplies environment values.'
        },
        {
            id: 'workflows', title: 'Build & deploy', outside: true,
            sub: ['Argo Workflows · GitOps'], short: 'Build & deploy',
            box: { wide: [552, 666, 208, 64], narrow: [186, 498, 166, 56] },
            detail: 'Delivery submits and observes build, test, and deployment workflows. A release records its source revision and image digest. GitOps applies the deployment, and Delivery reports the result.'
        },
        {
            id: 'platform', title: 'agent-platform', outside: true,
            sub: ['Contracts · acceptance', 'shared CI workflows'], short: 'agent-platform',
            box: { wide: [16, 560, 184, 84], narrow: [8, 700, 344, 68] },
            detail: 'The shared repository for architecture, service contracts, acceptance scenarios, and CI workflows. It defines how the platform fits together and how to verify it; it is not a running service.'
        }
    ];

    // path: hand-routed lines that would otherwise cross a box.
    var EDGES = [
        { from: 'channels', to: 'studio', label: 'Requests from people signed in through Studio' },
        { from: 'coding', to: 'memory', label: 'Personal client credential to recall, remember, and hand off' },
        { from: 'plugins', to: 'studio', label: 'Studio syncs skills and MCP declarations' },
        {
            from: 'studio', to: 'memory', label: 'User grant over MCP for memories and handoffs',
            path: { narrow: 'M100 208 C100 240 47 236 47 268' }
        },
        { from: 'studio', to: 'knowledge', label: 'User grant over MCP for documents, graph, and audio' },
        { from: 'studio', to: 'forge', label: 'User grant over MCP for workspaces, runs, and Git; approvals stay in Forge' },
        {
            from: 'studio', to: 'delivery', label: 'User grant over MCP for resources and app delivery; secret entry and approvals stay in Delivery',
            path: {
                wide: 'M400 324 V564 Q400 574 410 574 H552',
                narrow: 'M300 208 C300 240 313 236 313 268'
            }
        },
        {
            from: 'studio', to: 'models', label: 'Current model HTTP API with a per-call grant for one approved model',
            path: {
                wide: 'M430 324 V332 Q430 342 440 342 H870 Q880 342 880 332 V294',
                narrow: 'M93 208 V400'
            }
        },
        { from: 'memory', to: 'models', label: 'Per-call grant or service credential' },
        { from: 'knowledge', to: 'models', label: 'Per-call grant or service credential' },
        { from: 'forge', to: 'models', label: 'Per-call grant or service credential, including sandbox calls' },
        { from: 'forge', to: 'sandbox', label: 'Runs commands and coding CLIs with a run-scoped token' },
        {
            from: 'forge', to: 'delivery', label: 'Short-lived token exchange, then dev values for one run',
            path: { narrow: 'M244 344 C244 372 300 372 300 344' }
        },
        { from: 'delivery', to: 'resources', label: 'Creates databases and prefixes, and stores values in SSM' },
        {
            from: 'delivery', to: 'workflows', label: 'Build, test, and deploy; observe the result before reporting success',
            path: { narrow: 'M300 344 C300 368 268 364 268 380 V480 Q268 490 269 498' }
        },
        { from: 'workflows', to: 'apps', label: 'GitOps deploys the release to the selected environment' },
        {
            from: 'resources', to: 'apps', label: 'External Secrets delivers only the target environment’s values',
            path: { narrow: 'M313 456 V472 Q313 482 328 482 H346 Q356 482 356 492 V616 Q356 626 352 626' }
        },
        { from: 'models', to: 'providers', label: 'Only Models holds provider keys' }
    ];

    var VIEW = { wide: [1040, 746], narrow: [360, 784] };

    var byId = {};
    NODES.forEach(function (node) { byId[node.id] = node; });

    function el(name, attrs, parent) {
        var node = document.createElementNS(SVG_NS, name);
        Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
        if (parent) parent.appendChild(node);
        return node;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Connect the facing sides of two boxes with a smooth curve.
    function edgePath(a, b) {
        var ax = a[0], ay = a[1], aw = a[2], ah = a[3];
        var bx = b[0], by = b[1], bw = b[2], bh = b[3];
        var x0, y0, x1, y1, mid;
        if (by >= ay + ah) {
            x0 = clamp(bx + bw / 2, ax + 16, ax + aw - 16); y0 = ay + ah;
            x1 = clamp(x0, bx + 16, bx + bw - 16); y1 = by;
        } else if (by + bh <= ay) {
            x0 = clamp(bx + bw / 2, ax + 16, ax + aw - 16); y0 = ay;
            x1 = clamp(x0, bx + 16, bx + bw - 16); y1 = by + bh;
        } else {
            var right = bx >= ax + aw;
            x0 = right ? ax + aw : ax; x1 = right ? bx : bx + bw;
            y0 = clamp(by + bh / 2, ay + 14, ay + ah - 14);
            y1 = clamp(y0, by + 14, by + bh - 14);
            mid = (x0 + x1) / 2;
            return 'M' + x0 + ' ' + y0 + ' C' + mid + ' ' + y0 + ' ' + mid + ' ' + y1 + ' ' + x1 + ' ' + y1;
        }
        mid = (y0 + y1) / 2;
        return 'M' + x0 + ' ' + y0 + ' C' + x0 + ' ' + mid + ' ' + x1 + ' ' + mid + ' ' + x1 + ' ' + y1;
    }

    function linksOf(id) {
        return EDGES.filter(function (edge) { return edge.from === id || edge.to === id; });
    }

    function render(map, layout) {
        var size = VIEW[layout];
        var narrow = layout === 'narrow';
        map.textContent = '';

        var svg = el('svg', {
            viewBox: '0 0 ' + size[0] + ' ' + size[1],
            role: 'group',
            'aria-label': 'Agent Platform services and how they connect'
        }, map);
        svg.classList.add('arch-svg');

        var defs = el('defs', {}, svg);
        ['arch-arrow', 'arch-arrow-on'].forEach(function (id) {
            var marker = el('marker', {
                id: id, viewBox: '0 0 10 10', refX: 9, refY: 5,
                markerWidth: 7, markerHeight: 7, orient: 'auto'
            }, defs);
            el('path', { d: 'M1 1 9 5 1 9z', 'class': id }, marker);
        });

        var edgeLayer = el('g', { 'class': 'arch-edges', 'aria-hidden': 'true' }, svg);
        EDGES.forEach(function (edge) {
            var d = edge.path && edge.path[layout] ? edge.path[layout] : edgePath(byId[edge.from].box[layout], byId[edge.to].box[layout]);
            edge.el = el('path', { d: d, 'class': 'arch-edge', 'marker-end': 'url(#arch-arrow)' }, edgeLayer);
        });

        var nodeLayer = el('g', { 'class': 'arch-nodes' }, svg);
        NODES.forEach(function (node) {
            var b = node.box[layout];
            var g = el('g', {
                'class': 'arch-box' + (node.product ? ' p-' + node.id : '') + (node.outside ? ' is-outside' : ''),
                tabindex: 0,
                role: 'button',
                'aria-pressed': 'false',
                'aria-label': node.title + '. ' + node.detail
            }, nodeLayer);
            g.dataset.id = node.id;
            el('rect', { x: b[0], y: b[1], width: b[2], height: b[3], rx: narrow ? 10 : 12 }, g);

            // Small boxes centre a mark and a short name; larger boxes list the role beside the mark.
            if (narrow && b[2] < 140) {
                var cx = b[0] + b[2] / 2;
                var nameY = b[1] + b[3] / 2 + 4;
                if (node.product) {
                    el('image', { href: 'images/agent-' + node.id + '.png', x: cx - 12, y: b[1] + 12, width: 24, height: 24 }, g);
                    nameY = b[1] + b[3] - 16;
                }
                el('text', { x: cx, y: nameY, 'text-anchor': 'middle', 'class': 'arch-title', 'font-size': 13 }, g)
                    .textContent = node.short;
            } else {
                var lines = narrow ? (node.subNarrow || node.sub.slice(0, 1)) : node.sub;
                var titleSize = narrow ? 14 : 15;
                var lineGap = narrow ? 15 : 16;
                var iconSize = narrow ? 28 : 32;
                var tx = b[0] + 16;
                var top = b[1] + (b[3] - titleSize - lines.length * lineGap) / 2 + titleSize * 0.8;
                if (node.product) {
                    el('image', { href: 'images/agent-' + node.id + '.png', x: b[0] + 14, y: b[1] + (b[3] - iconSize) / 2, width: iconSize, height: iconSize }, g);
                    tx = b[0] + iconSize + 28;
                }
                el('text', { x: tx, y: top, 'class': 'arch-title', 'font-size': titleSize }, g).textContent = node.title;
                lines.forEach(function (line, i) {
                    el('text', { x: tx, y: top + (i + 1) * lineGap, 'class': 'arch-sub', 'font-size': narrow ? 11.5 : 12 }, g)
                        .textContent = line;
                });
            }
            node.el = g;
        });

        return svg;
    }

    function init() {
        var map = document.querySelector('[data-arch-map]');
        var panel = document.querySelector('[data-arch-panel]');
        if (!map || !panel) return;
        var figure = map.closest('.arch');
        var selected = 'studio';
        var svg;

        function highlight(id) {
            var linked = {};
            linked[id] = true;
            linksOf(id).forEach(function (edge) { linked[edge.from] = true; linked[edge.to] = true; });
            svg.classList.toggle('has-focus', Boolean(id));
            NODES.forEach(function (node) {
                node.el.classList.toggle('is-active', node.id === id);
                node.el.classList.toggle('is-linked', Boolean(id && linked[node.id]));
                node.el.setAttribute('aria-pressed', String(node.id === selected));
            });
            EDGES.forEach(function (edge) {
                var on = Boolean(id) && (edge.from === id || edge.to === id);
                edge.el.classList.toggle('is-on', on);
                edge.el.setAttribute('marker-end', on ? 'url(#arch-arrow-on)' : 'url(#arch-arrow)');
            });
        }

        function describe(id) {
            var node = byId[id];
            panel.textContent = '';
            panel.className = 'arch-panel' + (node.product ? ' p-' + node.id : '');

            var head = document.createElement('div');
            head.className = 'arch-panel-head';
            var title = document.createElement('h4');
            title.className = 'display';
            title.textContent = node.title;
            head.appendChild(title);
            if (node.href) {
                var link = document.createElement('a');
                link.href = node.href;
                link.textContent = node.linkText || 'Details';
                if (node.href.charAt(0) !== '#') {
                    link.target = '_blank';
                    link.rel = 'noopener';
                }
                head.appendChild(link);
            }
            panel.appendChild(head);

            var text = document.createElement('p');
            text.textContent = node.detail;
            panel.appendChild(text);

            var list = document.createElement('ul');
            list.className = 'arch-links';
            linksOf(id).forEach(function (edge) {
                var item = document.createElement('li');
                var route = document.createElement('span');
                route.className = 'mono';
                route.textContent = byId[edge.from].title + ' → ' + byId[edge.to].title;
                item.appendChild(route);
                item.appendChild(document.createTextNode(edge.label));
                list.appendChild(item);
            });
            panel.appendChild(list);
        }

        function select(id) {
            selected = id;
            highlight(id);
            describe(id);
        }

        function draw() {
            svg = render(map, NARROW.matches ? 'narrow' : 'wide');
            highlight(selected);
        }

        map.addEventListener('click', function (event) {
            var box = event.target.closest('.arch-box');
            if (box) select(box.dataset.id);
        });
        map.addEventListener('keydown', function (event) {
            var box = event.target.closest('.arch-box');
            if (box && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                select(box.dataset.id);
            }
        });
        map.addEventListener('focusin', function (event) {
            var box = event.target.closest('.arch-box');
            if (box) select(box.dataset.id);
        });
        // Hover previews a box; leaving the map returns to the selected one.
        map.addEventListener('pointerover', function (event) {
            var box = event.target.closest('.arch-box');
            if (box && event.pointerType === 'mouse') highlight(box.dataset.id);
        });
        map.addEventListener('pointerleave', function () {
            highlight(selected);
        });

        NARROW.addEventListener('change', draw);

        draw();
        describe(selected);
        figure.classList.add('is-ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
