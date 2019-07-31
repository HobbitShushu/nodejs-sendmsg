from multiprocessing import Pool
import os, sys

PATH = "cd C:/redis"

def redis_start(conf):
    os.system(PATH+' && redis-server ' + conf) 

if __name__ == '__main__':
    with Pool(processes=3) as pool:
        redis_list = ['7000/redis.conf', '7001/redis.conf', '7002/redis.conf']
        pool.map(redis_start, redis_list)