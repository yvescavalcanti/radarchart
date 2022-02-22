const path = require('path');


const HtmlWebpackPlugin = require('html-webpack-plugin');


if(process.env.NODE_ENV === 'production'){

}

module.exports = {
    entry : './index.js',
    mode: "development",
	module:{
		rules:[
			{
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-proposal-class-properties']
					}
				}
			}
		]	
	},
	output: {
		filename: 'bundle.js',
		library:'RadarChart',
		path: path.resolve(__dirname, 'dist'),
		publicPath: 'dist'
    }
};
