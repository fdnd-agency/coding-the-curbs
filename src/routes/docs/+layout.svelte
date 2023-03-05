<script>
	import { Documentation, Nav } from '@fdnd/components';

	const data = {
		Smartzone: {
			// GET: '/docs/method#get',
			// '[slug]': '/docs/method#slug'
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		Smartzones: {
			// GET: '/docs/methods#get'
		},
		
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
