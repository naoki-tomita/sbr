# multiple vehicle position drawing tool.
* client: draw image of car moving trajectory.
* data sender: send car coordinate to *server*.
* server: send coordinate to *client*.

### data generator
* Walker.ts: A walker's position history.
  * Sample data was borrowed from [this site](http://www.ic.daito.ac.jp/~mizutani/gps/gps_visualizer.html).
* BusLocation.ts: Toei bus realtime location.

![animation.gif](animation.gif)
![screenshot.png](screenshot.png)

## getting started
#### run server

```shell
$ yarn
$ yarn dev
```

#### open client

open http://localhost:5173

#### run data sender

```shell
# run Walker.ts
$ yarn mock
# or run BusLocation.ts
$ cd data-generator && yarn ts BusLocation.ts
```