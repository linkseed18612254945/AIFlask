def row_add(r1, r2):
    r3 = []
    for x, y in zip(r1, r2):
        r3.append(x + y)
    return r3

def row_mn(r, n):
    r2 = []
    for i in range(len(r)):
        r2.append(r[i] * n)
    return r2


e = [[1, 2, 1, 2], [3, 8, 1, 12], [0, 4, 1, 2]]
for i in range(len(e) - 1):
    pivot = e[i][i]
    if pivot == 0:
        for j in range(i + 1, len(e)):
            if e[j][i] != 0:
                e[i], e[j] = e[j], e[i]
    arg = -e[i + 1][i] / pivot
    e[i + 1] = row_add(e[i + 1], row_mn(e[i], arg))



