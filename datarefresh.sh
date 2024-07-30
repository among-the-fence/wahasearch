mkdir -p wahasearch/src/lib
cd wahasearch/src/lib

rm -rf data
mkdir data
cd data
git clone --depth 1 https://github.com/game-datacards/datasources.git
git clone --depth 1 https://github.com/BSData/wh40k-10e.git

for d in */ ; do
  echo $d.git*
  rm -rf $d.git*
done
