'use strict';


module.exports = ['$http', '$q', function($http, $q) {
	var _pages = {};

	var _config={};
	this.setConfig = function(config) {
		_config = config;
	};

	this.getPage = function(pageName) {


		function loadConfig(url) {
			return $http.get(url+'/config.json')
			.then(function(res) {
				return res.data;
			})
			.catch(function() {
				return {};
			})
			.then(function(config) {
				return config;
			});
		}

		if(_pages[pageName]) {
			return $q.when(_pages[pageName]);
		} else {
			var pagesUrl = _config.pagesUrl || './pages';
			var pageUrl = pagesUrl + '/' + pageName;


			var page = {
				url: pageUrl,
				name: pageName,
				pages: [],
				totalPages: [],
				getSub: function(name) {
					this._subs = this._subs || {};



					if(this._subs[name]) {

						return $q.when(this._subs[name]);
					} else {
						var sub = this.totalPages.filter(function(item) {
							return item.name === name;
						})[0];

						if(!sub) {
							console.log('Sub not found');
							throw new Error('Sub not found!');
						} else {

							sub.view = (sub.view)? this.url + sub.view: null || this.url + '/' + name+'.md';
							this._subs[name] = sub;
							return $q.when(sub);
						}


					}
				}
			};




			return loadConfig(page.url)
			.then(function(config) {


				page.pages = page.pages.concat(config.pages || []);
				page.groupedPages = config.groupedPages;

				page.totalPages = page.totalPages.concat(page.pages);

				page.view = page.url + '/index.md';

				if(page.groupedPages) {
					page.groupedPages.forEach(function(item) {
						page.totalPages = page.totalPages.concat(item.pages || []);
					});
				}

				_pages[pageName] = page;




				return page;
			});
		}



	};

}];
