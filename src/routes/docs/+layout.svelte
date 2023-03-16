<script>
	import { Documentation} from '@fdnd/components';

	const data = {
		Smartzone: {
			GET: '/docs/smartzone/#get',
			'[slug]': '/docs/smartzone/#slug'
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		Smartzones: {
			GET: '/docs/smartzones#get'
		},
		
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
