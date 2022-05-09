from py2neo import Graph, Node, Relationship
import json

# 连接neo4j数据库，输入地址、用户名、密码
graph = Graph('http://localhost:7474', auth=("neo4j", "123456"))
military_list = []
country = set()
category = set()
with open('../json_data/military.json', 'r', encoding='utf8') as fp:
    for line in fp.readlines():
        dic = json.loads(line)
        country.add(dic["产国"])
        category.add(dic["大类"])
        military_list.append(dic)

country_nodes = []
category_nodes = []
for i in country:
    node = Node("国家", name=i)
    country_nodes.append(node)
    graph.create(node)

for i in category:
    node = Node("大类", name=i)
    category_nodes.append(node)
    graph.create(node)


def find(key, target_list, target):
    if key == "国家" or key == "大类":
        for node in target_list:
            if node["name"] == target:
                return node


for i in military_list:
    del i["_id"]
    i["name"] = i["名称"]
    del i["名称"]
    country_node = find("国家", country_nodes, i["产国"])
    category_node = find("大类", category_nodes, i["大类"])
    del i["产国"]
    del i["大类"]
    node = Node("武器", **i)
    graph.create(node)
    rela_1 = Relationship(node, "产国", country_node)
    graph.create(rela_1)
    rela_2 = Relationship(node, "属于", category_node)
    graph.create(rela_2)
