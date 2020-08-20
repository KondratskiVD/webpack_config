import * as $ from 'jquery';
import Post from '@models/Post';
import '@/style/style.css'
import '@/style/custom.scss'
import json from '@/assets/data'
import WebpackLogo from '@/assets/img/logo.png'
import '../babel.js'

const post = new Post('Webpack post title', WebpackLogo)

$('pre').html(post.toString())

console.log('Post to string: ', post.toString())

console.log(json)

import('lodash').then( _ => {
  console.log('Lodash', _.random(0, 42,true))
})