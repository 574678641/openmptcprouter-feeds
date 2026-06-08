'use strict';
'require form';
'require view';
'require uci';

return view.extend({
	load: function() {
		return uci.load('omr-metrics');
	},

	render: function() {
		var m, s, o;

		m = new form.Map('omr-metrics', _('WAN Metrics — Settings'),
			_('Configure how per-interface metrics are collected and sent to the VPS.'));

		s = m.section(form.NamedSection, 'settings', 'settings');
		s.anonymous = true;
		s.addremove = false;

		o = s.option(form.Flag, 'send_to_vps', _('Send metrics to VPS'),
			_('POST per-interface metrics to every configured VPS server at the interval below.'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Value, 'interval', _('Send interval'),
			_('How often metrics are sent to the VPS, in seconds.'));
		o.datatype = 'uinteger';
		o.placeholder = '30';
		o.depends('send_to_vps', '1');

		s.option(form.Flag, 'enable_weight_sync', _('Enable weight sync'),
			_('Synchronise <code>multipath_weight</code> values into the BPF scheduler map and ip route weights.'))
			.default = '1';

		o = s.option(form.Flag, 'enable_decision_weights', _('Enable model-assigned weights'),
			_('Poll <code>GET /metrics/decision</code> on the VPS and apply the returned per-interface weights before the BPF sync.'));
		o.default = '1';
		o.depends('enable_weight_sync', '1');

		o = s.option(form.Flag, 'decision_predict', _('Enable prediction'),
			_('Ask the VPS model to extrapolate metrics forward in time before scoring interfaces.'));
		o.default = '0';
		o.depends('enable_decision_weights', '1');

		o = s.option(form.Value, 'decision_horizon', _('Prediction horizon'),
			_('How far ahead (in seconds) to extrapolate metrics when prediction is enabled. Range: 1 – 86400.'));
		o.datatype = 'range(1, 86400)';
		o.placeholder = '300';
		o.depends('decision_predict', '1');

		return m.render();
	}
});
