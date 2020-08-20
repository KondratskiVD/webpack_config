import * as $ from 'jquery';
import Post from '@models/Post';
import '@/style/style.css'
import json from '@/assets/data'
import WebpackLogo from '@/assets/img/logo.png'

const post = new Post('Webpack post title', WebpackLogo)

$('pre').html(post.toString())

console.log('Post to string: ', post.toString())

console.log(json)