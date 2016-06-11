Playing with Kafka, nothing to see here.

First get Kafka running using: https://github.com/DeviantArt/standalone-kafka

`node ingress.js` will read the Wikipedia web socket feed into kafka topic `wiki-ingress`
 
`node user-stats.js` will collect some basic stats from the feed in kafka.
 
