from pylab import *
from bs4 import BeautifulSoup

f = open("world2.svg")
soup = BeautifulSoup(f.read(), 'html.parser')
map = soup.find(id="worldmap")
for child in map.findChildren("path" , recursive=False):

    print(child["data-name"])
    country_name_to_country_alpha2(cn_name, cn_name_format="default")
